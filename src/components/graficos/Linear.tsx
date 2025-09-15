import type { ChartDataset, ChartOptions } from "chart.js";
import { Line } from "react-chartjs-2";
import type { GradePerformance } from "../../api/api-dashboard";

function randomColor(alpha = 1) {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r},${g},${b},${alpha})`;
}

type Distribution = {
    level: number;
    name: string;
    percentage: number;
};

export type Evolution = {
    eventId: number;
    eventName: string;
    distribution: Distribution[];
};


// function randomColor(alpha = 1) {
//     const r = Math.floor(Math.random() * 255);
//     const g = Math.floor(Math.random() * 255);
//     const b = Math.floor(Math.random() * 255);
//     return `rgba(${r},${g},${b},${alpha})`;
// }



export default function MultiLineChart(props: {
    data: GradePerformance[];
    title?: string;
}) {
    // Labels = anos/séries
    const labels = props.data.map(g => g.grade);

    // Pega todos os nomes de níveis (assumindo que todos os anos têm os mesmos níveis)
    const levelNames = props.data[0]?.distribution.map(d => d.name) ?? [];

    // Monta datasets (cada nível = uma linha)
    const datasets: ChartDataset<"line">[] = levelNames.map((name, idx) => ({
        label: name,
        data: props.data.map(g => g.distribution[idx].percentage),
        borderColor: randomColor(),
        backgroundColor: randomColor(0.3),
        tension: 0.4,
    }));

    const options: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio :true,
        plugins: {
            legend: {
                position: "left",
            },
            title: {
                display: true,
                text: props.title ?? "Evolução dos Níveis de Leitura",
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    callback: value => value + "%",
                },
            },
        },
    };

    return (
        <div className="h-96">
            <Line data={{ labels, datasets }} options={options} />
        </div>
    );
}

export function LineGraph(props : { labels : string[], data : number[]}) {
    const options: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: false,
                position: "right",
            },
            title: {
                display: true,
                text: "Exemplo de Gráfico de Linha",
            },
        },
    };

    const data = {
        labels: props.labels,
        datasets: [
            {
                data:props.data,
                borderColor: "#3b82f6",
                backgroundColor: "#3b82f6",
                tension: 0.4,
            },
        ],
    };

    return (
        <div className="h-96">
            <Line data={data} options={options} />
        </div>
    );
}