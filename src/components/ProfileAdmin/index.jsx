import { Card, Space } from 'antd';
import React from 'react';
import EditNameAdmin from './EditNameAdmin';
import EditNameAndAvatar from './EditAvatar';
import EditPassword from './EditPassword';

export default function ProfileAdmin() {
	return (
		<div className="p-2 mx-auto w-full mt-4 flex items-center justify-center">
			<Card hoverable style={{ display: 'inline-block' }}>
				<Space direction="vertical" size="large">
					<EditNameAndAvatar />
					<EditNameAdmin />
					<EditPassword />
				</Space>
			</Card>
		</div>
	);
}
