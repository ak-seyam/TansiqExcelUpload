import {Router} from "express"

const PingRouter = Router()

PingRouter.get("/ping", (_, res) => {
	res.send("pong");
})

export default PingRouter;