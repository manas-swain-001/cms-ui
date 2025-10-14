import React from 'react';
import Icon from '../AppIcon';

const Table = ({
    data = [],
    columns = [],
    onRowClick,
    className = "",
    loading = false,
    // Custom className props
    headerClassName = "",
    rowClassName = "",
    cellClassName = "",
    // Function-based className props
    getHeaderClassName = null,
    getRowClassName = null,
    getCellClassName = null
}) => {

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="text-center py-8">
                <Icon name="Database" size={48} className="text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No data available</p>
            </div>
        );
    }

    return (
        <div className={`bg-card border border-border rounded-lg overflow-hidden ${className}`}>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className={`bg-muted/50 ${headerClassName}`}>
                        <tr>
                            {columns.map((column, index) => {
                                const defaultHeaderClass = "px-4 py-3 text-left text-sm font-medium text-muted-foreground";
                                const customHeaderClass = getHeaderClassName ? getHeaderClassName(column, index) : "";
                                const columnHeaderClass = column.headerClassName || "";
                                
                                return (
                                    <th
                                        key={index}
                                        className={`${defaultHeaderClass} ${customHeaderClass} ${columnHeaderClass}`.trim()}
                                    >
                                        {column.header}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {data.map((row, rowIndex) => {
                            const defaultRowClass = "hover:bg-muted/30 transition-colors";
                            const clickableClass = onRowClick ? 'cursor-pointer' : '';
                            const customRowClass = getRowClassName ? getRowClassName(row, rowIndex) : "";
                            
                            return (
                                <tr
                                    key={rowIndex}
                                    className={`${defaultRowClass} ${clickableClass} ${customRowClass} ${rowClassName}`.trim()}
                                    onClick={() => onRowClick && onRowClick(row, rowIndex)}
                                >
                                    {columns.map((column, colIndex) => {
                                        const defaultCellClass = "px-4 py-3 text-sm text-foreground";
                                        const customCellClass = getCellClassName ? getCellClassName(row, rowIndex, column, colIndex) : "";
                                        const columnCellClass = column.cellClassName || "";
                                        
                                        return (
                                            <td
                                                key={colIndex}
                                                className={`${defaultCellClass} ${customCellClass} ${columnCellClass} ${cellClassName}`.trim()}
                                            >
                                                {column.render ? column.render(row[column.key], row, rowIndex) : row[column.key]}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Table;