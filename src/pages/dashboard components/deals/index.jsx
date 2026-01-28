import styles from "./deals.module.css";
import * as XLSX from "xlsx";


const dealsData = [
  {
    name: "CRM Setup",
    company: "Acme Corp",
    stage: "Proposal",
    value: "₹1,20,000",
    owner: "Varshini",
    close: "12 Feb",
  },
  {
    name: "Website Redesign",
    company: "Nova Labs",
    stage: "Won",
    value: "₹85,000",
    owner: "Ravi",
    close: "05 Feb",
  },
  {
    name: "Landing Page",
    company: "Pixel Studio",
    stage: "Negotiation",
    value: "₹45,000",
    owner: "Anu",
    close: "18 Feb",
  },
];

export default function Deals({ branch }) {
  const handleExportDeals = () => {
    const formattedData = dealsData.map((d) => ({
      Deal: d.name,
      Company: d.company,
      Stage: d.stage,
      Value: d.value,
      Owner: d.owner,
      "Close Date": d.close,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const csv = XLSX.utils.sheet_to_csv(worksheet);

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "deals.csv";
    link.click();

    URL.revokeObjectURL(url);
  };


  return (
    <div className={styles.dealsPage}>

      {/* Top Stats */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <span>Total Value</span>
          <b>₹2.5L</b>
        </div>
        <div className={styles.statCard}>
          <span>Open Deals</span>
          <b>8</b>
        </div>
        <div className={styles.statCard}>
          <span>Won</span>
          <b>5</b>
        </div>
        <div className={styles.statCard}>
          <span>Lost</span>
          <b>2</b>
        </div>
      </div>

      {/* Export Deals */}
      <div className={styles.exportSection}>
        <div className={styles.exportText}>
          <h3>Export Deals</h3>
          <p>
            Download your deals data to analyze updates or share with your team.
          </p>
        </div>

        <button className={styles.exportBtn} onClick={handleExportDeals}>
          Export Deals
        </button>
      </div>


      {/* Deals Table */}
      <div className={styles.tableWrap}>
        <table>
          <thead>
            <tr>
              <th>Deal</th>
              <th>Company</th>
              <th>Stage</th>
              <th>Value</th>
              <th>Owner</th>
              <th>Close Date</th>
            </tr>
          </thead>
          <tbody>
            {dealsData.map((d, i) => (
              <tr key={i}>
                <td>{d.name}</td>
                <td>{d.company}</td>
                <td>
                  <span className={`${styles.stage} ${styles[d.stage.toLowerCase()]}`}>
                    {d.stage}
                  </span>
                </td>
                <td>{d.value}</td>
                <td>{d.owner}</td>
                <td>{d.close}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
