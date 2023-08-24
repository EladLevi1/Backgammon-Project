import Profile from "./profile.model";

export default class ChatMessage {
    constructor(
        public sender: Profile = new Profile(),
        public content: string = "",
        public timestamp: Date = new Date()
    ) {}
}