import ChatMessage from './chatMessage.model';

export default class GlobalChat {
    constructor(
        public _id: string = "",
        public messages: ChatMessage[] = []
    ) {}
}