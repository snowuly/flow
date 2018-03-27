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
	const maxLen = data.reduce((curLen, arrayItem) => Math.max(curLen, arrayItem.length), 0); // 流程图中一个大节点中最多的子节点数 这个最大长度决定了流程图的高度
	const marginH = 50; // Horizontal margin  节点间水平间距
	const marginV = 40; // Vertical margin 垂直间距
	const nodeHeight = 110; // 节点高度
	const nodeWidth = 90; // 节点宽度

	const w = nodeWidth + marginH;
	const h = nodeHeight + marginV;
	data.forEach((arr, index) => {
		const x = index*w; // x 是当前节点的x坐标
		const offsetY = Math.floor((maxLen-arr.length)*h/2); // 这个是节点的y坐标偏移 就是节点上面需要空处多大空间  根据最大高度和当前子节点数算出来的
		arr.forEach((node, index) => {
			node.x = x;
			node.y = offsetY + index*(nodeHeight+marginV); // 节点y坐标 根据间距和高度算出来

			const py = node.y + Math.floor(nodeHeight/2) - 15;  // 节点连接线点的y坐标 调整这个可以是连接线在圆圈的垂直中点
			node.leftPoint = { // lefPoint是节点左侧连接线的点
				x, // 左侧x坐标 ，调整这个可以调整 连接线与节点的间距
				y: py,
			};
			node.rightPoint = { // 节点右侧连接线的点
				x: x + nodeWidth, // 节点右侧的x坐标 可以调整线与节点的间距
				y: py,
			};
		});
	});

	return {
		height: maxLen*nodeHeight+(maxLen-1)*marginV, // 这个是整个流程图的高度
		width: data.length*nodeWidth+(data.length-1)*marginH, // 整个流程图的宽度
	};
}
// 这个函数返回的所有线的react组建数组
function drawLines(data) {
	let result = [];
	data.reduce((leftNodes, rightNodes) => { // 流程图中的大节点 就是数据中二维数组的第一层   每个大节点会包含几个小节点 就是具体的每个圆圈
		result = result.concat(drawLine(leftNodes, rightNodes)); // 这个drawLine函数就是画每个大节点之间的线
		return rightNodes;
	});
	return result;
}
// 画两个大节点间的线  就是第一个大节点每个小节点leftPoint 第二个大节点每个小节点rightPoint
// 画线的顺序是 先画第一个大节点所有小节点的线  然后画两个大节点中间那根小横线 然后画第二个大节点子节点的线
function drawLine(from, to) {
	const lines = [];

	const { x: fx, y: fy } = from[0].rightPoint; // fx 第一个大节点第一个小节点的x坐标
	const { x: tx, y: ty } = to[0].leftPoint;
	const flen = from.length;
	const tlen = to.length;
	
	const mx = fx + Math.floor((tx-fx)/2); // 这个是两个大节点中间点的x坐标
	const msx = mx - 5; // 这个就是两个第一个大节点的线画到的x坐标  这个值越小 线就越靠近第一个大节点
	const mex = mx +5; //  这个是第二个大节点开始画线的起点x坐标 这个值越大 线越靠近第二个大节点

	let lineLength;

	if (flen > 1) { // 第一个大节点的小节点数大于一的时候 需要画那根垂直线
		lineLength = msx - fx; // 这时横线的长度
		
		from.forEach(({ rightPoint: { y } }) => {
			lines.push(hline(fx, y, lineLength)); // 画每一个小节点的横线
		});

		const bottomY = from[flen-1].rightPoint.y; // 这个是那个垂直线的底部的y坐标
		lines.push(vline(fx+lineLength, fy, bottomY-fy)); // 画垂直线

		lines.push(hline(msx, fy + Math.floor((bottomY-fy)/2), mex-msx)); // 这是两个大节点间的小横线 
	} else { // 如果只有一个节点  那就直接画一根横线就可以了 
		lines.push(hline(fx, fy, mex-fx));
	}

	lineLength = tx - mex; // 右侧节点横线的长度
	to.forEach(({ leftPoint: { y } }) => {
		lines.push(hline(mex, y, lineLength, true)); // 画右侧节点的横线 带上箭头 
	});
	if (tlen > 1) { // 如果节点数大于1  需要画那根垂直线
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

