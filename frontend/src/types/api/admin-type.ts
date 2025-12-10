export type IOverviewAdmin = {
  summary: {
    grossSales: number;
    platformRevenue: number;
    totalUsers: number;
    totalProducts: number;
  };
  overview: {
    salesAndPlatformRevenue: Array<{
      month: string;
      grossSales: number;
      platformRevenue: number;
    }>;
    productsByCategory: Array<{
      category: string;
      totalProducts: number;
    }>;
    recentActivities: Array<{
      id: string;
      title: string;
      customerName: string;
      price: number;
      createdAt: string;
    }>;
  };
};

export type ITransactionAdmin = {
  data: Array<{
    id: string;
    title: string;
    buyer: {
      name: string;
      email: string;
    };
    seller: {
      name: string;
      email: string;
    };
    price: number;
    orderStatus: string;
    createdAt: string;
  }>;
  page: number;
  totalPages: number;
};

export type IPayoutsRequests = {
  data: Array<{
    id: string;
    amount: number;
    date: string;
    status: string;
    creator: {
      name: string;
      email: string;
      avatar: string;
    };
    method: string;
  }>;
  pendingRequest: number;
  successRequest: number;
  totalPaidOut: number;
  page: number;
  totalPage: number;
};

export type ICategoriesAdmin = {
  id: string;
  name: string;
  label: string;
  productCount: number;
};
