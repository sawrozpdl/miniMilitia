class Peer {

    constructor(userId, isInitiator) {
        this.userId = userId;
        this.isInitiator = isInitiator;

        this.iceServers = [{
            url : 'stun:stun.l.google.com:19302' // to determine public ip-address
        }]

        this.dataChannelReady = false,
        this.peerConnection = null,
        this.dataChannel = null,
        this.remoteDescriptionReady = false,
        this.pendingCandidates = null,
        this.lastMessageOrd = null
    }

    
}

export default Peer;