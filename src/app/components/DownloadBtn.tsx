
import { DownloadTableExcel } from 'react-export-table-to-excel-xlsx';
import { FiDownloadCloud } from 'react-icons/fi';

interface DownloadBtnProps {
  tableRef: React.RefObject<null>;
  fileName: string;
}

const DownloadBtn = ({ tableRef, fileName }: DownloadBtnProps) => {
  return (
    <DownloadTableExcel
      filename={fileName}
      sheet={fileName}
      currentTableRef={tableRef.current}
    >
      <button
        className="border-2 border-teal-600 text-teal-600 font-bold hover:scale-105 px-6 py-2 flex items-center gap-2 rounded-md transition duration-500 ease-linear"
      >
        <FiDownloadCloud />
        Download
      </button>

    </DownloadTableExcel>

  );
};

export default DownloadBtn;