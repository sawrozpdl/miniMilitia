class Peer {

    constructor(userId, isInitiator) {
        this.userId = userId;
        this.isInitiator = isInitiator;

        this.iceServers = [{
            url : 'stun:stun.l.google.com:19302' // to determine public ip-address
        }]
    }

    
}

export default Peer;