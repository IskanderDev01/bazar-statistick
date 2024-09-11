import { Line } from 'react-chartjs-2';
import {
    Chart,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import Card from 'antd/es/card/Card';
import { GraphicData, IFilter } from '@/entities/main';

Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
);

interface PeakHoursProps {
    data: GraphicData[] | undefined;
    filter: IFilter;
}

const PeakHours = ({ data, filter }: PeakHoursProps) => {
    const weekdaysOrder = [
        'monday',
        'tuesday',
        'wednesday',
        'thoursday',
        'friday',
        'saturday',
        'sunday',
    ];
    const sortedData = data?.slice().sort((a: GraphicData, b: GraphicData) => {
        if (filter === 'week' && a.weekday && b.weekday) {
            return (
                weekdaysOrder.indexOf(a.weekday) -
                weekdaysOrder.indexOf(b.weekday)
            );
        }

        if (filter === 'month' && a.day && b.day) {
            return new Date(a.day).getTime() - new Date(b.day).getTime();
        }

        if (filter === 'day' && a.time && b.time) {
            return a.time.localeCompare(b.time);
        }

        return 0;
    });

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        return `Количество машин: ${context.raw}`;
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                min: 0,
                ticks: {
                    stepSize: 1,
                },
            },
            x: {
                title: {
                    display: true,
                    text:
                        filter === 'day'
                            ? 'Время'
                            : filter === 'week'
                            ? 'День недели'
                            : 'Дата',
                },
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: 10,
                },
            },
        },
    };

    const dataSet = {
        labels: sortedData?.map((item) =>
            filter === 'day'
                ? item.time
                : filter === 'week'
                ? item.weekday
                : item.day,
        ),
        datasets: [
            {
                label: 'Количество машин',
                data: sortedData?.map((item) => item.count),
                borderColor:
                    filter === 'day'
                        ? 'rgba(75, 192, 192, 1)'
                        : filter === 'week'
                        ? 'rgba(153, 102, 255, 1)'
                        : 'rgba(255, 159, 64, 1)',
                backgroundColor:
                    filter === 'day'
                        ? 'rgba(75, 192, 192, 0.2)'
                        : filter === 'week'
                        ? 'rgba(153, 102, 255, 0.2)'
                        : 'rgba(255, 159, 64, 0.2)',
                fill: true,
                lineTension: 0.3,
            },
        ],
    };

    return (
        <Card
            title={`Пиковое время за ${
                filter === 'day'
                    ? 'день'
                    : filter === 'week'
                    ? 'неделю'
                    : 'месяц'
            }`}
            className="shadow-lg rounded-lg overflow-hidden mx-auto my-4 p-4 w-full max-w-4xl"
        >
            <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] flex items-center">
                <Line data={dataSet} options={options} />
            </div>
        </Card>
    );
};

export default PeakHours;
