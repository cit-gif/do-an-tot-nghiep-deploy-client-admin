import { useState, useEffect, useCallback, useRef } from 'react';
import api from '@src/config/api';
import cookieCutter from 'cookie-cutter';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { serverApi } from '@src/config/constrant';
import { useQuill, configQuill } from './useQuill/useQuill';

export default function IndexPage(props) {
	const { editorContent, setEditorContent, editorContentDefault, onContentChange } = props;
	const router = useRouter();
	const { enqueueSnackbar } = useSnackbar();
	const [quill, setQuill] = useState(null);

	useEffect(() => {
		if (quill === null) return;
		const handler = (delta, oldDelta, source) => {
			const html = quill.root.innerHTML;
			const currrentContents = quill.getContents();
			if (onContentChange) {
				onContentChange(html, currrentContents);
				return;
			}
			setEditorContent({ deltaOps: currrentContents, html: html });
			//#region delete Image
			// if (source === 'user') {
			// 	/**
			// 	 * check change is delete
			// 	 */
			// 	const checkDelete = delta.ops.findIndex(x => x.hasOwnProperty('delete'))
			// 	if (checkDelete !== -1) {

			// 		const diff = currrentContents.diff(oldDelta);
			// 		diff.ops.forEach(element => {
			// 			/**
			// 			 * check element is image
			// 			 */
			// 			if (element.hasOwnProperty('insert') && element?.insert?.hasOwnProperty('image')) {

			// 				/**
			// 				 * action...
			// 				 * check is url image
			// 				 */
			// 				const src = element.insert.image;
			// 				if (src.startsWith('_next/image?url=')) {
			// 					const newUrl = new URL('_next/image?url=http://localhost:3000/backend/images/7bd7f285695e4580bd3ee7cfec799828.jpeg&w=1920&q=100'.split('_next/image?url=')[1])
			// 					const srcImage = newUrl.pathname.split("&w=1920&q=100")[0];
			// 					setListImageDelete(prev => [...prev, srcImage]);
			// 				}

			// 			}
			// 		});
			// 	}
			// }
			//#endregion
		};

		quill.on('text-change', handler);
		return () => {
			if (quill) {
				quill.off('text-change', handler);
			}
		};
	}, [quill]);

	const handlerUploadImage = (file, resolve, reject) => {
		const accessTokenAdmin = cookieCutter.get('accessTokenAdmin');
		if (!accessTokenAdmin || accessTokenAdmin == '') {
			enqueueSnackbar('Bạn cần đăng nhập lại!', { variant: 'error' });
			reject('login again');
			router.push('/login');
		}

		const formData = new FormData();
		formData.append('image', file);

		api.post('/api/admin/uploadImage', formData, {
			headers: { 'Content-Type': 'multipart/form-data', authorization: accessTokenAdmin },
		})
			.then(response => resolve(`_next/image?url=${serverApi}${response.data.url}&w=1920&q=100`))
			.catch(error => {
				reject('Upload failed');
				if (error?.response?.data?.message) {
					enqueueSnackbar(error?.response?.data?.message, { variant: 'error' });
				}
			});
	};
	const wrapperRef = useCallback(wrapperRef => {
		if (wrapperRef == null) return;
		// const editor = document.createElement('div');
		// editor.className = "h-96"
		// wrapperRef.append(editor);
		const newQuill = new useQuill(wrapperRef, configQuill({ handleUploadImage: handlerUploadImage }));
		// if (editorContent?.deltaOps) newQuill.setContents(editorContent.deltaOps);
		setQuill(newQuill);
	}, []);
	const handleSetContentQuill = () => {
		if (!quill || !editorContentDefault) return;
		if (typeof editorContentDefault == 'string') {
			quill.root.innerHTML = editorContentDefault;
		} else {
			quill.setContents(editorContentDefault);
		}
	};

	useEffect(() => {
		// vì editorContentDefault nên gán giá trị nếu phát hiện thây đôi

		handleSetContentQuill();
	}, [editorContentDefault, quill]);

	return (
		<div className="bg-white">
			<div ref={wrapperRef} className="shadow h-96" />
		</div>
	);
}
