import React from "react";
import classnames from "classnames";
import { usePagination, DOTS } from "./usePagination";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";

const Pagination = (props) => {
	const { totalCount, siblingCount = 1, currentPage, pageSize, className, startUrl, endUrl, url } = props;

	const paginationRange = usePagination({
		currentPage,
		totalCount,
		siblingCount,
		pageSize,
	});
	const getUrl = (page) => {
		if (url) {
			return url + page;
		} else {
			return startUrl + page + endUrl;
		}
	};
	if (currentPage === 0 || paginationRange.length < 2) {
		return null;
	}
	const disabled_next_prev = "bg-gray-400 border-2 border-gray-700";
	const active_next_pre = "text-white bg-primary ";
	const selected = "bg-primary shadow-nextShadow text-white";
	const not_selected = "border-2 border-primary text-three";
	let lastPage = paginationRange[paginationRange.length - 1];
	return (
		<nav className='block'>
			<ul className={classnames("flext flex-row space-x-2", { [className]: className })}>
				<li className='inline-block'>
					<Link href={currentPage > 1 ? getUrl(parseInt(currentPage) - 1) : "#"}>
						<a
							onClick={(e) => {
								if (currentPage == 1) {
									e.preventDefault();
								}
							}}
							className={classnames("first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative", {
								[disabled_next_prev]: currentPage === 1,
								[active_next_pre]: currentPage !== 1,
							})}
						>
							<ChevronLeft />
						</a>
					</Link>
				</li>
				{paginationRange.map((pageNumber, key) => {
					if (pageNumber === DOTS) {
						return (
							<li className='inline-block' key={key}>
								<a
									onClick={(e) => e.preventDefault()}
									href='#'
									className={classnames("first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative ", {
										not_selected: true,
									})}
								>
									&#8230;
								</a>
							</li>
						);
					}

					return (
						<li className='inline-block' key={key}>
							<Link href={getUrl(pageNumber)}>
								<a
									className={classnames("first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative", {
										[selected]: pageNumber == currentPage,
										[not_selected]: pageNumber != currentPage,
									})}
								>
									{pageNumber}
								</a>
							</Link>
						</li>
					);
				})}
				<li className='inline-block'>
					<Link href={currentPage !== lastPage ? getUrl(parseInt(currentPage) + 1) : "#"}>
						<a
							onClick={(e) => {
								if (currentPage === lastPage) {
									e.preventDefault();
								}
							}}
							className={classnames("first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative", {
								[disabled_next_prev]: currentPage === lastPage,
								[active_next_pre]: currentPage !== lastPage,
							})}
						>
							<ChevronRight />
						</a>
					</Link>
				</li>
			</ul>
		</nav>
	);
};

export default Pagination;
