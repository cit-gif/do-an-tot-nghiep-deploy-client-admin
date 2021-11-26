import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import Button from "@material-tailwind/react/Button";
export const ExportExcel = ({ csvData, fileName }) => {
	const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
	const fileExtension = ".xlsx";

	const exportToCSV = (csvData, fileName) => {
		const ws = XLSX.utils.json_to_sheet(csvData);
		const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
		const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
		const data = new Blob([excelBuffer], { type: fileType });
		FileSaver.saveAs(data, fileName + fileExtension);
	};

	return (
		<Button onClick={() => exportToCSV(csvData, fileName)} color='cyan' buttonType='filled' size='regular' rounded={false} block={false} iconOnly={false} ripple='light'>
			Xuất file excel
		</Button>
	);
};
