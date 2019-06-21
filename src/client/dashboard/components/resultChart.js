import React from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';

const defaultChartOptions = {
	scales: {
		yAxes: [
			{
				ticks: {
					min: 0,
					callback: value => {
						if (Math.floor(value) === value) {
							return value;
						}
						return null;
					}
				}
			}
		]
	}
};

export default function ResultChart(props) {
	const { labels, errValues, warnValues } = props;

	const chartData = {
		labels,
		datasets: [
			{
				label: 'Errors',
				backgroundColor: 'rgba(244,67,45,0.5)',
				data: errValues
			},
			{
				label: 'Warnings',
				backgroundColor: 'rgba(255,152,0,0.5)',
				data: warnValues
			}
		]
	};

	return (
		<div className="w3-container">
			<div className="w3-row-padding w3-margin-top w3-white">
				<Bar data={chartData} width={100} height={30} options={defaultChartOptions} />{' '}
			</div>{' '}
		</div>
	);
}

ResultChart.propTypes = {
	labels: PropTypes.arrayOf(PropTypes.string),
	errValues: PropTypes.arrayOf(PropTypes.number),
	warnValues: PropTypes.arrayOf(PropTypes.number)
};

ResultChart.defaultProps = {
	labels: [],
	errValues: [],
	warnValues: []
};
