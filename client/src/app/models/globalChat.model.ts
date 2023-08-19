import Profile from './profile.model';

export default class GlobalChat {
    constructor(
        public _id: string = "",
        public messages: ChatMessage[] = []
    ) {}
}

export class ChatMessage {
    constructor(
        public sender: Profile,
        public content: string,
        public timestamp: Date = new Date()
    ) {}
}
