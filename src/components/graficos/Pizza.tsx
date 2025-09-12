import type { ChartOptions } from "chart.js";
import { Pie } from "react-chartjs-2";


function getVividColor(): string {
  // Hue (0 a 360) -> controla a cor
  const hue = Math.floor(Math.random() * 360);
  // Saturação alta (70% a 100%)
  const saturation = 70 + Math.random() * 30;
  // Luminosidade média/alta (40% a 60%)
  const lightness = 45 + Math.random() * 15;

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export default function Pizza(props : { data : { labels : string[] , values : number[]} , title : string}) {
    const options : ChartOptions<"pie"> = {
        responsive : true,
        maintainAspectRatio : true,
        plugins: {
            title : {
                display : true,
                text : props.title,
                align : "center",
                color : "#303030",
                font : {
                    size : 16,
                },
            },
            legend: {
                position: "right" as const,
                display: true
            }
        }
    };
    const data = {
        labels: props.data.labels,
        datasets: [
            {
                data: props.data.values,
                backgroundColor: props.data.labels.map(getVividColor)
            },
        ],
    }

    return (
        <div className="max-w-sm mx-auto">
            <Pie data={data} options={options}/>
        </div>
    );
}
