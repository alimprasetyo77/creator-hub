import {
  ChangePasswordType,
  IMyDashboardPurchasesInfo,
  IQueryMyPurchases,
  LoginType,
  RegisterType,
  UpdateUserType,
} from '../validations/user-validation';
import { validate } from '../validations/validation';
import userValidation from '../validations/user-validation';
import prisma from '../utils/prisma';
import { ResponseError } from '../utils/response-error';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRequest } from '../middlewares/auth-middleware';
import { supabase } from '../utils/supabase-client';
import fs from 'fs';

const register = async (request: RegisterType): Promise<void> => {
  const registerRequest = validate(userValidation.registerSchema, request);
  const totalUsersWithSameEmail = await prisma.user.count({
    where: {
      email: registerRequest.email,
    },
  });
  if (totalUsersWithSameEmail > 0) {
    throw new ResponseError(400, 'Email already exists');
  }
  registerRequest.password = await bcrypt.hash(registerRequest.password, 10);
  await prisma.user.create({
    data: registerRequest,
  });
};

const login = async (request: LoginType): Promise<{ token: string }> => {
  const loginRequest = validate(userValidation.loginSchema, request);
  const user = await prisma.user.findUnique({
    where: {
      email: loginRequest.email,
    },
  });
  if (!user) {
    throw new ResponseError(400, 'Email or password is incorrect');
  }

  const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);

  if (!isPasswordValid) {
    throw new ResponseError(400, 'Email or password is incorrect');
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY as string, { expiresIn: '1h' });

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      token,
    },
  });

  return { token };
};

const logout = async (token: string, user: UserRequest['user']): Promise<void> => {
  await prisma.user.update({
    where: {
      id: user?.id,
      token: token,
    },
    data: {
      token: null,
    },
  });
};

const get = async (user: UserRequest['user']): Promise<UserRequest['user']> => {
  if (user?.role === 'ADMIN') return user;
  if (user?.role === 'CREATOR') {
    return (await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        products: true,
        orders: true,
      },
    })) as UserRequest['user'];
  }
  return (await prisma.user.findUnique({
    where: { id: user?.id },
    include: {
      orders: true,
    },
  })) as UserRequest['user'];
};

const update = async (user: UserRequest['user'], request: UpdateUserType): Promise<UserRequest['user']> => {
  const updateUserRequest = validate(userValidation.updateSchema, request);

  let publicUrl;
  if (updateUserRequest.avatar) {
    if (user?.avatar) {
      const avatarPath = user?.avatar?.split('/').pop();
      const { data: removeResult, error: removeError } = await supabase.storage
        .from('avatar')
        .remove([avatarPath!]);
      if (removeError) {
        throw new ResponseError(400, removeError.message);
      }
    }
    const fileBuffer = fs.readFileSync(updateUserRequest.avatar.filepath);
    const { data: uploadResult, error: uploadError } = await supabase.storage
      .from('avatar')
      .upload(updateUserRequest.avatar.newFilename, fileBuffer, {
        contentType: updateUserRequest.avatar?.mimetype,
        upsert: false,
      });

    if (uploadError) {
      throw new ResponseError(400, uploadError.message);
    }

    const { data: result } = supabase.storage.from('avatar').getPublicUrl(uploadResult.path);

    publicUrl = result.publicUrl;
  }

  user = await prisma.user.update({
    where: {
      id: user!.id,
    },
    data: {
      ...updateUserRequest,
      avatar: publicUrl,
    },
    omit: {
      password: true,
    },
  });
  return user;
};

const changePassword = async (userId: string, request: ChangePasswordType): Promise<void> => {
  const changePasswordRequest = validate(userValidation.changePasswordSchema, request);
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ResponseError(400, 'User not found');
  }

  const isPasswordValid = await bcrypt.compare(changePasswordRequest.currentPassword, user.password);
  if (!isPasswordValid) {
    throw new ResponseError(400, 'Current password is incorrect');
  }

  changePasswordRequest.newPassword = await bcrypt.hash(changePasswordRequest.newPassword, 10);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: changePasswordRequest.newPassword,
    },
  });
};

const remove = async (user: UserRequest['user']): Promise<void> => {
  if (user?.avatar) {
    await supabase.storage.from('avatar').remove([user?.avatar?.split('/').pop()!]);
  }
  await prisma.user.delete({
    where: {
      id: user!.id,
    },
  });
};

const getMyDashboardPurchasesInfo = async (user: UserRequest['user']): Promise<IMyDashboardPurchasesInfo> => {
  const orders = await prisma.order.findMany({
    where: {
      userId: user?.id,
      orderStatus: 'PAID',
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      createdAt: true,
      paymentInfo: {
        select: {
          grossAmount: true,
        },
      },
    },
  });

  const response: IMyDashboardPurchasesInfo = {
    totalPurchases: orders.length,
    totalSpent: orders.reduce((total, order) => {
      if (!order.paymentInfo?.grossAmount) return total;
      return total + +order.paymentInfo?.grossAmount;
    }, 0),
    lastPurchase: orders[0].createdAt || null,
  };
  return response;
};

const getMyPurchases = async (user: UserRequest['user'], query: IQueryMyPurchases): Promise<{}> => {
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 10;

  const skip = (page - 1) * limit;

  const [orders, totalOrder] = await prisma.$transaction([
    prisma.order.findMany({
      where: {
        userId: user?.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        orderStatus: true,
        createdAt: true,
        items: {
          select: {
            product: {
              select: {
                id: true,
                title: true,
                description: true,
                price: true,
                thumbnail: true,
                slug: true,
                category: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                user: {
                  select: { avatar: true, full_name: true },
                },
              },
            },
            total: true,
          },
        },
        paymentInfo: {
          select: {
            grossAmount: true,
            paymentType: true,
            vaNumbers: true,
            transactionStatus: true,
          },
        },
      },
      skip,
      take: limit,
    }),
    prisma.order.count({
      where: {
        userId: user?.id,
      },
    }),
  ]);

  const response = {
    data: orders.map((order) => ({
      id: order.id,
      orderStatus: order.orderStatus.toLowerCase(),
      createdAt: order.createdAt,
      items: order.items.map((item) => {
        return {
          ...item.product,
          total: item.total,
        };
      }),
      paymentInfo: order.paymentInfo,
    })),
    page: page,
    hasMore: totalOrder > page * limit,
    totalOrder: totalOrder,
  };

  return response;
};

export default {
  register,
  login,
  get,
  update,
  remove,
  logout,
  changePassword,
  getMyPurchases,
  getMyDashboardPurchasesInfo,
};
