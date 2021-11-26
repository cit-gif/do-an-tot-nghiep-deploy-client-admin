import React from "react";
import classnames from "classnames";
import { usePagination, DOTS } from "./usePagination";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import { useRouter } from "next/router";

const PaginationNotLink = (props) => {
	const { totalCount, siblingCount = 1, currentPage, pageSize, className, queryKey = "page", handler = async () => {} } = props;

	const paginationRange = usePagination({
		currentPage,
		totalCount,
		siblingCount,
		pageSize,
	});
	const router = useRouter();
	const handleChange = async (page) => {
		await handler(page);
		const urlSearchParams = new URLSearchParams(window.location.search);
		const query = Object.fromEntries(urlSearchParams.entries());
		router.push(router.pathname, { query: { ...query, [queryKey]: page } }, { shallow: true });
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
			<ul className={classnames("flex flex-row items-center space-x-2", { [className]: className })}>
				<li className='inline-block cursor-pointer'>
					<a
						onClick={(e) => {
							if (currentPage === 1) {
								return e.preventDefault();
							}
							handleChange(currentPage - 1);
						}}
						className={classnames("first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative", {
							[disabled_next_prev]: currentPage === 1,
							[active_next_pre]: currentPage !== 1,
						})}
					>
						<ChevronLeft />
					</a>
				</li>
				{paginationRange.map((pageNumber, key) => {
					if (pageNumber === DOTS) {
						return (
							<li className='inline-block cursor-pointer' key={key}>
								<a
									onClick={(e) => e.preventDefault()}
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
						<li className='inline-block cursor-pointer' key={key}>
							<a
								onClick={(e) => {
									e.preventDefault();
									handleChange(pageNumber);
								}}
								className={classnames("first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative", {
									[selected]: pageNumber == currentPage,
									[not_selected]: pageNumber != currentPage,
								})}
							>
								{pageNumber}
							</a>
						</li>
					);
				})}
				<li className='inline-block cursor-pointer'>
					<a
						onClick={(e) => {
							if (currentPage === lastPage) {
								return e.preventDefault();
							}
							handleChange(currentPage + 1);
						}}
						className={classnames("first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative", {
							[disabled_next_prev]: currentPage === lastPage,
							[active_next_pre]: currentPage !== lastPage,
						})}
					>
						<ChevronRight />
					</a>
				</li>
			</ul>
		</nav>
	);
};

export default PaginationNotLink;
