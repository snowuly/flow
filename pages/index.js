import React, { PureComponent } from 'react';

import Flow from './flow';
import styles from './index.less';

const data = [
	[
		{ dep: 'Provider', name: 'MingMing', time: '2018/1/1 20:00', state: 'Under Review' },
	],
	[
		{ dep: 'Provider', name: 'MingMing', time: '2018/1/1 20:00', state: 'Under Review' },
		{ dep: 'Provider', name: 'MingMing', time: '2018/1/1 20:00', state: 'Under Review' },
		{ dep: 'Provider', name: 'MingMing', time: '2018/1/1 20:00', state: 'Under Review' },
	],
	[
		{ dep: 'Provider', name: 'MingMing', time: '2018/1/1 20:00', state: 'Under Review' },
	],
];

export default class Index extends PureComponent {
	render() {
		return (<div className={styles.cnt}>
			<Flow data={data} />
		</div>);
	}
}
