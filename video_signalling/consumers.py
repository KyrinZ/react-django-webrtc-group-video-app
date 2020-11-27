import json

from channels.generic.websocket import AsyncWebsocketConsumer


class VideoConsumer(AsyncWebsocketConsumer):

    USERS = []

    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = "room_%s" % self.room_name

        await (self.channel_layer.group_add)(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        user = self.find_user(self.user_id)
        self.USERS.remove(user)
        await (self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)

        if data["type"] == "store_user":
            self.user_id = data["new_user_id"]
            user = {"user_id": self.user_id, "media_enabled": False}
            self.USERS.append(user)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "new_user_joined",
                    "newUserId": data["new_user_id"],
                    "users": self.USERS,
                },
            )
        elif data["type"] == "media_enabled":
            user = self.find_user(data["user_id"])
            self.USERS.remove(user)
            user["media_enabled"] = True
            self.USERS.append(user)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "media_enabled",
                    "userId": data["user_id"],
                    "users": self.USERS,
                },
            )
        elif data["type"] == "sending_offer":
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "sending_offer",
                    "from": data["from"],
                    "to": data["to"],
                    "offer": data["offer"],
                },
            )

        elif data["type"] == "sending_answer":
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "sending_answer",
                    "from": data["from"],
                    "to": data["to"],
                    "answer": data["answer"],
                },
            )

    async def new_user_joined(self, event):
        await self.send(
            json.dumps(
                {
                    "type": "new_user_joined",
                    "newUserId": event["newUserId"],
                    "users": event["users"],
                }
            )
        )

    async def media_enabled(self, event):
        await self.send(
            json.dumps(
                {
                    "type": "media_enabled",
                    "userId": event["userId"],
                    "users": event["users"],
                },
            )
        )

    async def sending_offer(self, event):
        await self.send(
            json.dumps(
                {
                    "type": "sending_offer",
                    "from": event["from"],
                    "to": event["to"],
                    "offer": event["offer"],
                }
            )
        )

    async def sending_answer(self, event):
        await self.send(
            json.dumps(
                {
                    "type": "sending_answer",
                    "from": event["from"],
                    "to": event["to"],
                    "answer": event["answer"],
                }
            )
        )

    def find_user(self, user_id):
        for user in self.USERS:
            if user["user_id"] == user_id:
                return user

        return None