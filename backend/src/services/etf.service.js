
import csvParser from "csv-parser";
import { Readable } from "stream";

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRtB1pz0sdn4tfKRpvCJhy5dPckC7B12haLwtcsiQqGlYoXsq7yMSJYla3pzZ7G_7MtLQkP7ZJGfXCF/pub?gid=0&single=true&output=csv";

export async function getETFData() {
  try {
    const response = await fetch(SHEET_URL);
    if (!response.ok) {
      throw new Error("Unable to fetch sheet");
    }

    const csvText = await response.text();

    const rows = await new Promise((resolve, reject) => {
      const result = [];

      Readable.from(csvText)
        .pipe(csvParser({ headers: false }))
        .on("data", (row) => result.push(Object.values(row)))
        .on("end", () => resolve(result))
        .on("error", reject);
    });

    // A3:A68 with C3:C68
    const etfs = [];

    for (let i = 2; i <= 67 && i < rows.length; i++) {
      if (!rows[i]) continue;

      etfs.push({
        symbol: rows[i][0] || "",
        price: rows[i][2] || "",
      });
    }

    // I4:I13
    const summary = [];

    for (let i = 3; i <= 12 && i < rows.length; i++) {
      summary.push(rows[i][8] || "");
    }

    return {
      totalETF: etfs.length,
      etfs,
      summary,
    };
  } catch (err) {
    console.error(err);
    return {
      totalETF: 0,
      etfs: [],
      summary: [],
    };
  }
}