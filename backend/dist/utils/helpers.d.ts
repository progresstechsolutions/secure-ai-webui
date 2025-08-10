export declare const generateSlug: (text: string) => string;
export declare const formatFileSize: (bytes: number) => string;
export declare const isValidObjectId: (id: string) => boolean;
export declare const sanitizeHTML: (html: string) => string;
interface PaginationResult {
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
    total: number;
    offset: number;
    hasNext: boolean;
    hasPrev: boolean;
}
export declare const pagination: (page: string | number, limit: string | number, total: number) => PaginationResult;
export declare const formatTimestamp: (date: Date | string) => string;
export {};
//# sourceMappingURL=helpers.d.ts.map