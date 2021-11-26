import Quill from 'quill';
import ImageResize from 'quill-image-resize-module';
import * as Emoji from 'quill-emoji';
import ImageUploader from '../ImageUpload/quill.imageUploader';
import ImageFormat from '../ImageFormat';
import CustomIcons from './icons';
import CustomHandlers from './handlers';
import 'highlight.js/styles/darcula.css';
import 'quill/dist/quill.snow.css';
import 'quill-emoji/dist/quill-emoji.css';
//
import hljs from 'highlight.js';

const fontSizeArr = [
	'8px',
	'9px',
	'10px',
	'12px',
	'13px',
	'14px',
	'15px',
	'16px',
	'20px',
	'24px',
	'32px',
	'42px',
	'54px',
	'68px',
	'84px',
	'98px',
];

//#region Quill register
Quill.register('modules/imageUploader', ImageUploader);
// Quill.register("modules/imageResize", ImageResize);

// quill span-wrapper https://stackoverflow.com/questions/53625555/create-custom-attribute-in-quill-js
/**
 *  giũ nguyên sty khi căng giữa image
 */

Quill.register(ImageFormat, true);
const icons = Quill.import('ui/icons');
icons['span-wrapper'] = 'SW';
icons['imageURL'] = 'iURl';
icons['clean'] = CustomIcons.trash;
icons['fullScreen'] = CustomIcons.fullScreen;
icons['exitFullScreen'] = CustomIcons.exitFullscreen;

const Parchment = Quill.import('parchment');
const SpanWrapper = new Parchment.Attributor.Class('span-wrapper', 'span', { scope: Parchment.Scope.BLOCK });
Quill.register(SpanWrapper, true);

// Quill.register("modules/emoji", Emoji);

const ListItem = Quill.import('formats/list/item');
const ListQuill = Quill.import('formats/list');
// ListItem.tagName = "DIV";
Quill.register(
	{
		'formats/list/item': ListItem,
		'formats/list': ListQuill,
	},
	true
);

const DirectionAttribute = Quill.import('attributors/attribute/direction');
Quill.register(DirectionAttribute, true);

const AlignClass = Quill.import('attributors/class/align');
Quill.register(AlignClass, true);

const BackgroundClass = Quill.import('attributors/class/background');
Quill.register(BackgroundClass, true);

const ColorClass = Quill.import('attributors/class/color');
Quill.register(ColorClass, true);

const DirectionClass = Quill.import('attributors/class/direction');
Quill.register(DirectionClass, true);

const FontClass = Quill.import('attributors/class/font');
Quill.register(FontClass, true);

const SizeClass = Quill.import('attributors/class/size');
Quill.register(SizeClass, true);

const AlignStyle = Quill.import('attributors/style/align');
Quill.register(AlignStyle, true);

const BackgroundStyle = Quill.import('attributors/style/background');
Quill.register(BackgroundStyle, true);

const ColorStyle = Quill.import('attributors/style/color');
Quill.register(ColorStyle, true);

const DirectionStyle = Quill.import('attributors/style/direction');
Quill.register(DirectionStyle, true);

const FontStyle = Quill.import('attributors/style/font');
Quill.register(FontStyle, true);

const SizeStyle = Quill.import('attributors/style/size');
SizeStyle.whitelist = fontSizeArr;
Quill.register(SizeStyle, true);
//#endregion
// const table = Quill.import("modules/table");
// Quill.register(table, true);
const configQuill = ({ handleUploadImage }) => ({
	modules: {
		// #3 Add "image" to the toolbar
		history: {
			// Enable with custom configurations
			delay: 2500,
			userOnly: true,
		},
		syntax: {
			highlight: text => hljs.highlightAuto(text).value,
		},
		// table: true, // disable table module
		// "better-table": true,

		toolbar: {
			container: [
				[{ header: [1, 2, 3, 4, 5, 6, false] }],

				['bold', 'italic', 'underline', 'strike'], // toggled buttons
				['blockquote', 'code-block', 'span-wrapper'],
				[{ size: fontSizeArr }],
				['image', 'video', 'link', 'imageURL'],
				// [{ header: 1 }, { header: 2 }], // custom button values
				[{ list: 'ordered' }, { list: 'bullet' }],
				[{ script: 'sub' }, { script: 'super' }], // superscript/subscript
				[{ indent: '-1' }, { indent: '+1' }], // outdent/indent
				[{ direction: 'rtl' }], // text direction

				// [{ size: ["small", false, "large", "huge"] }], // custom dropdown

				[{ color: [] }, { background: [] }], // dropdown with defaults from theme
				[{ font: [] }],
				[{ align: [] }],

				['clean'], // remove formatting button
				['fullScreen', 'exitFullScreen'],
			],
			handlers: {
				'span-wrapper': function (e) {
					const range = this.quill.getSelection();
					const format = this.quill.getFormat(range);
					if (!format['span-wrapper']) {
						this.quill.format('span-wrapper', 'wrapper');
					} else {
						this.quill.removeFormat(range.index, range.index + range.length);
					}
				},
				emoji: function (e) {},

				imageURL: function (e) {
					var range = this.quill.getSelection();
					var value = prompt('What is the image URL');
					if (value) {
						this.quill.insertEmbed(range.index, 'image', value, Quill.sources.USER);
					}
					//#region
					// const inputUrl = document.createElement("input");
					// inputUrl.placeholder = "Url";
					// inputUrl.style.position = "absolute";
					// inputUrl.style.transform = "translate(-50%,-50%)";
					// inputUrl.style.top = "50%";
					// inputUrl.style.left = "50%";
					// inputUrl.style.width = "200px";
					// inputUrl.style.padding = "5px 0";
					// this.quill.container.appendChild(inputUrl);
					// if (inputUrl.value && inputUrl.value !== '') {
					// 	this.quill.insertEmbed(range.index, 'image', value, Quill.sources.USER);
					// }
					//#endregion
				},
				fullScreen: CustomHandlers.fullScreen,
				exitFullScreen: CustomHandlers.exitFullScreen,
			},
		},
		imageUploader: {
			upload: file => {
				return new Promise((resolve, reject) => {
					handleUploadImage(file, resolve, reject);
				});
			},
		},
		imageResize: {
			modules: ['Resize', 'DisplaySize', 'Toolbar'],
		},
		'emoji-toolbar': true,
		'emoji-textarea': true,
		'emoji-shortname': true,
		// "image-tooltip": true,
		// "link-tooltip": true,
	},
	formats: [
		'header',
		'bold',
		'italic',
		'width',
		'code-block',
		'image',
		'video',
		'underline',
		'strike',
		'blockquote',
		'list',
		'bullet',
		'indent',
		'script',
		'link',
		'imageURL',
		'imageResize',
		'imageUploader',
		'emoji',
		'Resize',
		'DisplaySize',
		'Toolbar',
		'imageBlot', // #5 Optinal if using custom formats
		'color',
		'font',
		'align',
		'size',
		'direction',
		'background',
		'link',
		'span-wrapper',
		'clean',
	],
	// placeholder: 'Tạo bài viết cho nhóm sản phẩm này',
	theme: 'snow',
});

export { Quill as useQuill, configQuill };
