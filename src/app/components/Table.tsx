"use client"
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    Row,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import { useState, useRef, useEffect } from "react";
import { AccessorFn } from "@tanstack/react-table";
import DownloadBtn from "./DownloadBtn";
import SearchInput from "./SearchInput";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { FaSearch } from "react-icons/fa";
import BeatLoader from 'react-spinners/BeatLoader';
import { HiArrowsUpDown } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
import { GrEdit } from "react-icons/gr";
import DeletePopup from '../components/DeletePopup';
import EditUserModal from "./EditUserModal";
import EditBookModal from "./EditBookModal";
import EditNoteModal from "./EditNoteModal";
import EditQuestionModal from "./EditQuestionModal";
import { useToast } from "../hooks/useToast";

export interface HeaderProps {
    column: string | AccessorFn<any>;
    header: string;
}

interface TableProps {
    tableHeader: Array<HeaderProps>;
    tableData: any[];
    loading: boolean | undefined;
    title: string;
    error: string | null;
    fileName: string;
}

const TableComponent = ({ tableHeader, tableData: initialTableData, loading, error, title, fileName }: TableProps) => {
    const tableRef = useRef(null);
    const [globalFilter, setGlobalFilter] = useState("");
    const columnHelper = createColumnHelper<any>();
    const [sorting, setSorting] = useState<SortingState>([])
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [tableData, setTableData] = useState(initialTableData);
    const { showToast } = useToast();

    useEffect(() => {
        setTableData(initialTableData);
    }, [initialTableData]);

    const columns = [
        ...tableHeader.map((header) =>
            columnHelper.accessor(header.column, {
                cell: (info: any) => {
                    if (header.column === 'bookUrl' || header.column === 'notesUrl' || header.column === 'questionsUrl') {
                        return <a href={info.getValue()} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:no-underline">Click to open {title}</a>;
                    }
                    return <span>{info.getValue()}</span>;
                },
                header: header.header,
            })
        )
    ];

    const table = useReactTable({
        data: tableData,
        columns,
        state: {
            globalFilter,
            sorting,
        },
        getFilteredRowModel: getFilteredRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
    });

    function handleEdit(row: Row<any>): void {
        const rowData = row.original;
        setSelectedRow(rowData);
        setEditModalVisible(true);
        console.log("Editing row:", rowData);
    }

    function handleDelete(row: Row<any>): void {
        const rowData = row.original;
        setSelectedRow(rowData);
        setPopupVisible(true);
    }

    const handleCancelDelete = () => {
        setPopupVisible(false);
    };

    const handleDeleteConfirmed = (rowData: any) => {
        // Logic to remove the row from the tableData
        const updatedTableData = tableData.filter(data => data.id !== rowData.id);
        setTableData(updatedTableData);
        setPopupVisible(false);
        showToast({ type: "success", message: `${title} deleted successfully` });
    };

    const handleSave = (updatedRow: any) => {
        const updatedTableData = tableData.map((data) =>
            data.id === updatedRow.id ? updatedRow : data
        );
        setTableData(updatedTableData);
        console.log('Row updated:', updatedRow);
        setEditModalVisible(false);
    };

    const handleCancelEdit = () => {
        setEditModalVisible(false);
    };

    return (
        <div>
            {isPopupVisible && selectedRow && (
                <DeletePopup
                    onDelete={handleDeleteConfirmed}
                    onCancel={handleCancelDelete}
                    rowData={selectedRow}
                    collectionName={`${title}s`}
                />
            )}
            {isEditModalVisible && selectedRow && (
                title.toLowerCase() === "user" && (
                    <EditUserModal
                        user={selectedRow}
                        onSave={handleSave}
                        onCancel={handleCancelEdit}
                    />) ||
                title.toLowerCase() === "book" && (
                    <EditBookModal
                        book={selectedRow}
                        onSave={handleSave}
                        onCancel={handleCancelEdit}
                    />
                ) ||
                title.toLowerCase() === "note" && (
                    <EditNoteModal
                        note={selectedRow}
                        onSave={handleSave}
                        onCancel={handleCancelEdit}
                    />
                ) ||
                title.toLowerCase() === "question" && (
                    <EditQuestionModal
                        question={selectedRow}
                        onSave={handleSave}
                        onCancel={handleCancelEdit}
                    />
                )
            )}
            <div className="flex sm:flex-nowrap flex-wrap items-center sm:justify-between justify-end gap-5 mb-4">
                <div className="md:hidden">
                    <DownloadBtn tableRef={tableRef} fileName={fileName} />
                </div>
                <div className="relative w-full flex items-center gap-1">
                    <div className="absolute left-3">
                        <FaSearch color="teal" />
                    </div>
                    <SearchInput
                        value={globalFilter ?? ""}
                        onChange={(value: string) => setGlobalFilter(String(value))}
                        className="p-2 pl-9 bg-transparent outline-none border-2 xl:w-1/4 lg:w-1/3 md:w-1/2 w-full xl:focus:w-1/3 lg:focus:w-1/2 md:focus:w-3/5 duration-300 rounded-md border-teal-600"
                        placeholder="Search ..."
                    />
                </div>
                <div className="md:block hidden">
                    <DownloadBtn tableRef={tableRef} fileName={fileName} />
                </div>
            </div>
            <div className="overflow-x-auto flex flex-col scrollbar-thin scrollbar-thumb-teal-500 scrollbar-track-teal-100">
                <div className="inline-block min-w-full my-2">
                    <table ref={tableRef} className="border-2 border-gray-300 w-full text-left rounded-md overflow-auto scrollbar-thin scrollbar-thumb-teal-500 scrollbar-track-teal-100">
                        <thead className="bg-teal-600 text-white rounded-md w-full">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th key={header.id} className="capitalize px-3.5 py-2">
                                            <div onClick={header.column.getToggleSortingHandler()} className={`${header.column.getCanSort() && "flex gap-1 items-center cursor-pointer select-none duration-300"}`}>
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                <HiArrowsUpDown />
                                            </div>
                                        </th>
                                    ))}
                                    <th></th>
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {!loading && table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row, i) => (
                                    <tr
                                        key={row.id}
                                        className={`
                                    ${i % 2 === 0 ? "bg-teal-100" : "bg-teal-50"}
                                    `}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id} className="px-3.5 py-2">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                        <td className="px-3.5 py-2">
                                            <div className="flex gap-2 items-center">
                                                <button className="bg-teal-600 hover:bg-teal-700 text-white font-bold p-2 rounded" onClick={() => handleEdit(row)}>
                                                    <GrEdit />
                                                </button>
                                                <button onClick={() => handleDelete(row)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded">
                                                    <MdDelete />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) :
                                loading ?
                                    (
                                        <tr className="h-32">
                                            <td colSpan={12}>
                                                <div className="flex items-center justify-center">
                                                    <BeatLoader
                                                        color="teal"
                                                        loading={loading}
                                                        aria-label="Loading Spinner"
                                                        data-testid="loader"
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ) :
                                    error ? (
                                        <tr className="font-bold h-32">
                                            <td colSpan={12}>
                                                <div className="flex flex-col gap-1 items-center justify-center text-center text-gray-800 text-lg">
                                                    We Faced Some Incoveniences. Please try again later.
                                                    <span className="text-red-500">{error}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) :
                                        (<tr className="text-center text-lg font-bold h-32">
                                            <td colSpan={12}>No {title} Available!</td>
                                        </tr>
                                        )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* pagination */}
            <div className="flex md:flex-row flex-col items-center justify-between gap-2 mt-2">
                <div className="flex gap-1">
                    <p className="text-gray-600 capitalize font-semibold">Total {title}s:</p>
                    <span className="font-bold">{tableData.length}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            table.previousPage();
                        }}
                        disabled={!table.getCanPreviousPage()}
                        className="border-2 border-teal-400 hover:border-teal-500 text-teal-400 hover:text-teal-500 p-1 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <FaChevronLeft size={18} />
                    </button>
                    <button
                        onClick={() => {
                            table.nextPage();
                        }}
                        disabled={!table.getCanNextPage()}
                        className="border-2 border-teal-400 hover:border-teal-500 text-teal-400 hover:text-teal-500 p-1 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <FaChevronRight size={18} />
                    </button>

                    <span className="flex items-center gap-1">
                        <div>Page</div>
                        <strong>
                            {table.getState().pagination.pageIndex + (table.getPageCount() !== 0 ? 1 : 0)} of{" "}
                            {table.getPageCount()}
                        </strong>
                    </span>
                    <select
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => {
                            table.setPageSize(Number(e.target.value));
                        }}
                        className="p-1 rounded border-2 border-teal-600 hover:border-teal-500 focus:outline-none focus:border-teal-800 text-teal-800 bg-transparent font-semibold"
                    >
                        {[5, 10, 20, 30, 50].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default TableComponent;