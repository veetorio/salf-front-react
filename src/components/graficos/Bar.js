import { Bar } from "react-chartjs-2";
export function YearlyBarChart({ yearly }) {
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
    const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Comparativo Anual" },
        },
    };
    return <Bar data={data} options={options}/>;
}
export function BarChartCommon(props) {
    // labels dinâmicos com base nos anos recebidos
    // dataset flexível com base nos totais
    const dataELement = {
        labels: props.labels,
        datasets: [
            {
                data: props.values,
                backgroundColor: "#001682"
            },
        ],
    };
    const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: { position: "top", display: false },
            title: { display: true, text: "Comparativo Anual" },
        },
    };
    return <Bar data={dataELement} options={options}/>;
}
