import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import zhuce from './views/zhuce.vue'
import yuyin from './views/yuyin.vue'
import about from './views/about.vue'
import text from './views/text.vue'
import home from './views/home.vue'
import liveBroadcast from './views/liveBroadcast/index.vue'

let routes = [{
	path: '/login',
	component: Login,
	name: '',
	hidden: true,
	meta: {
		required: false
	}
},
{
	path: '/zhuce',
	component: zhuce,
	name: '',
	hidden: true,
	meta: {
		required: false
	}
},
{
	path: '/a45963add6c56959057c91f5b9b1d577',
	component: yuyin,
	name: '',
	hidden: true,
	meta: {
		required: true
	}
},
{
	path: '/a45963add6c56959057c9lf5b9b1d577',
	component: text,
	name: '',
	hidden: true,
	meta: {
		required: true
	}
},
{
	path: '/about',
	component: about,
	name: '',
	hidden: true,
	meta: {
		required: true
	}
},
{
	path: '/404',
	component: NotFound,
	name: '',
	hidden: true,
},
// {
// 	path: '*',
// 	hidden: true,
// 	redirect: {
// 		path: '/a45963add6c56959057c91f5b9b1d577'
// 	}
// },
{
	path: '/home',
	component: home,
	name: '',
	hidden: true,
	meta: {
		required: true
	}
},
{
	path: '/liveBroadcast',
	component: liveBroadcast,
	name: '',
	hidden: true,
	meta: {
		required: true
	}
},
];

export default routes;
