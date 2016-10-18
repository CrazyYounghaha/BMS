/**
 * Created by zhangyang on 16/10/12.
 */
export default {
		on: true, //是否开启 WebSocket
		type: "socket.io", //使用的 WebSocket 库类型，默认为 socket.io
		allow_origin: "", //允许的 origin
		adp: undefined, // socket 存储的 adapter，socket.io 下使用
		path: "", //url path for websocket
		messages: {
				//open: "home/index/open", // WebSocket 建立连接时处理的 Action
				//close: "home/index/close", // WebSocket 关闭时处理的 Action
				//adduser: "home/index/adduser", //adduser 事件处理的 Action
				//privatemessage: "home/index/privatemessage",
				confirm: "home/index/confirm",
				confirmvip: "home/index/confirmvip"
		}
};