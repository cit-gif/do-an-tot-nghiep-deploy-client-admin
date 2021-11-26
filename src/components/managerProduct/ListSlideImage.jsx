import React from 'react';
import { Space, Card, Image } from 'antd';
import PropTypes from 'prop-types';

function ListSlideImage(props) {
	const { data } = props;
	return (
		<div className="w-full">
			<Space>
				<Card>
					<Image src="" />
				</Card>
			</Space>
		</div>
	);
}

export default ListSlideImage;
