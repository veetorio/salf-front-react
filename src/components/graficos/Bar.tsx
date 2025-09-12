import type { ChartData, ChartOptions } from "chart.js";
import { Bar } from "react-chartjs-2";

export type YearData = {
  year: number;
  total: number;
};

export type YearlyProps = {
  yearly: {
    currentYear: YearData;
    previousYear: YearData;
  };
};

export function YearlyBarChart({ yearly }: YearlyProps) {
  // labels dinâmicos com base nos anos recebidos
  const labels = [yearly.previousYear.year.toString(), yearly.currentYear.year.toString()];

  // dataset flexível com base nos totais
  const data = {
    labels,
    datasets: [
      {
        label: "Total",
        data: [yearly.previousYear.total, yearly.currentYear.total].reverse(),
        backgroundColor: ["#6366F1", "#22C55E"], // cores diferentes
      },
    ],
  };

  const options : ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio : true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Comparativo Anual" },
    },
  };

  return <Bar data={data} options={options} />;
}
export function BarChartCommon(props : {  labels : string[],values : number[]}) {
  // labels dinâmicos com base nos anos recebidos

  // dataset flexível com base nos totais
  const dataELement : ChartData<"bar"> = {
    labels : props.labels,
    datasets: [
      {
        data: props.values,
        backgroundColor : "#001682"
      },
    ],
  };

  const options : ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio : true,
    
    plugins: {
      legend: { position: "top" as const , display : false },
      title: { display: true, text: "Comparativo Anual" },
    },
  };

  return <Bar data={dataELement} options={options} />;
}


