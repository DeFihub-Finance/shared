export interface PaginatedResponse<T> {
    data: T[];
    metadata: {
        page: number;
        perPage: number;
        totalEntries: number;
    }
}
