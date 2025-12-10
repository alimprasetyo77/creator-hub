import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { getPaginationPages } from '@/lib/utils';

type PaginationCustomProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function PaginationCustom({ page, totalPages, onPageChange }: PaginationCustomProps) {
  const pages = getPaginationPages(page, totalPages);

  if (totalPages <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href='#'
            onClick={(e) => {
              e.preventDefault();
              if (page > 1) onPageChange(page - 1);
            }}
          />
        </PaginationItem>

        {pages.map((p, i) => (
          <PaginationItem key={i}>
            {p === '...' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href='#'
                isActive={p === page}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(p);
                }}
              >
                {p}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href='#'
            onClick={(e) => {
              e.preventDefault();
              if (page < totalPages) onPageChange(page + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
