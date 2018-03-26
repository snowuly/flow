import React, { PureComponent } from 'react';
import styles from './flow.less';

class Node extends PureComponent {
	render() {
		const { dep, name, time, state, x, y } = this.props;
		return (
			<div className={styles.node} style={{ left: `${x}px`, top: `${y}px` }}>
				<header>
					<p>{dep}</p>
					<p>{name}</p>
				</header>
				<footer>
					<p>{time}</p>
					<p>{state}</p>
				</footer>
			</div>
		);
	}
}

export default class Flow extends PureComponent {
	render() {
		const { data } = this.props;
		const { width, height } = getPosition(data);
		return (
			<div className={styles.cnt} style={{ height: `${height}px`, width: `${width}px`  }}>
				{ data.reduce((lines, subArr) => lines.concat(subArr)) // flat 2d array
						.map((nodeData, index) => <Node key={index} {...nodeData } />) }
				{ drawLines(data) }
			</div>
		);
	}
}

function getPosition(data) {
	const maxLen = data.reduce((curLen, arrayItem) => Math.max(curLen, arrayItem.length), 0);
	const marginH = 50; // Horizontal margin
	const marginV = 40; // Vertical margin
	const nodeHeight = 110;
	const nodeWidth = 90;

	const w = nodeWidth + marginH;
	const h = nodeHeight + marginV;
	data.forEach((arr, index) => {
		const x = index*w;
		const offsetY = Math.floor((maxLen-arr.length)*h/2);
		arr.forEach((node, index) => {
			node.x = x;
			node.y = offsetY + index*(nodeHeight+marginV);

			const py = node.y + Math.floor(nodeHeight/2) - 15;
			node.leftPoint = {
				x,
				y: py,
			};
			node.rightPoint = {
				x: x + nodeWidth,
				y: py,
			};
		});
	});

	return {
		height: maxLen*nodeHeight+(maxLen-1)*marginV,
		width: data.length*nodeWidth+(data.length-1)*marginH,
	};
}
function drawLines(data) {
	let result = [];
	data.reduce((leftNodes, rightNodes) => {
		result = result.concat(drawLine(leftNodes, rightNodes));
		return rightNodes;
	});
	return result;
}
function drawLine(from, to) {
	const lines = [];

	const { x: fx, y: fy } = from[0].rightPoint;
	const { x: tx, y: ty } = to[0].leftPoint;
	const flen = from.length;
	const tlen = to.length;
	
	const mx = fx + Math.floor((tx-fx)/2);
	const msx = mx - 5;
	const mex = mx +5;

	let lineLength;

	if (flen > 1) {
		lineLength = msx - fx;
		
		from.forEach(({ rightPoint: { y } }) => {
			lines.push(hline(fx, y, lineLength));
		});

		const bottomY = from[flen-1].rightPoint.y;
		lines.push(vline(fx+lineLength, fy, bottomY-fy));

		lines.push(hline(msx, fy + Math.floor((bottomY-fy)/2), mex-msx));
	} else {
		lines.push(hline(fx, fy, mex-fx));
	}

	lineLength = tx - mex;
	to.forEach(({ leftPoint: { y } }) => {
		lines.push(hline(mex, y, lineLength, true));
	});
	if (tlen > 1) {
		lines.push(vline(mex, ty, to[tlen-1].leftPoint.y - ty));
	}
	return lines;

}
// direction 0: left arrow 1: right arrow
function hline(x, y, len, hasArrow) {
	return <div key={`h-${x}-${y}`} className={styles.hline} style={{ left: `${x}px`, top: `${y}px`, width: len }}>{ hasArrow ? <div className={styles.arrow}></div> : null }</div>;	
}
function vline(x, y, len) {
	return <div key={`v-${x}-${y}`} className={styles.vline} style={{ left: `${x}px`, top: `${y}px`, height: len }}></div>;
}

