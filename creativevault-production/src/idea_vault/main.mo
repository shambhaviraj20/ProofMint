import Time "mo:base/Time";
import Map "mo:base/HashMap";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Option "mo:base/Option";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";

persistent actor CreativeVault {

    /* ===================== TYPES ===================== */

    public type IdeaStatus = {
        #Public;
        #Private;
        #RevealLater;
    };

    public type SemanticReport = {
        score: Nat;     // 0–100
        risk: Text;     // "LOW" | "MEDIUM" | "HIGH"
    };

    public type Idea = {
        id: Text;
        title: Text;
        description: Text;
        creator: Principal;
        timestamp: Int;
        status: IdeaStatus;
        ipfsHash: ?Text;
        isRevealed: Bool;
        revealTimestamp: ?Int;
        proofHash: Text;
        version: Nat;
        tags: [Text];
        category: Text;
        semantic: ?SemanticReport;
    };

    public type IdeaInput = {
        title: Text;
        description: Text;
        status: IdeaStatus;
        ipfsHash: ?Text;
        tags: [Text];
        category: Text;
        semantic: ?SemanticReport;
    };

    public type ProofRecord = {
        ideaId: Text;
        proofHash: Text;
        timestamp: Int;
        creator: Principal;
        isVerified: Bool;
        blockHeight: Nat;
        canisterId: Text;
        network: Text;
    };

    public type UserProfile = {
        principal: Principal;
        username: ?Text;
        email: ?Text;
        createdAt: Int;
        totalIdeas: Nat;
        publicIdeas: Nat;
        reputation: Nat;
    };

    public type CollaborativeIdea = {
        ideaId: Text;
        collaborators: [Principal];
        permissions: [(Principal, [Text])];
        requiredSignatures: Nat;
        currentSignatures: [(Principal, Int)];
        isFinalized: Bool;
    };

    /* ===================== STORAGE ===================== */

    private stable var nextIdeaId: Nat = 0;
    private stable var ideasEntries: [(Text, Idea)] = [];
    private stable var userIdeasEntries: [(Principal, [Text])] = [];
    private stable var userProfilesEntries: [(Principal, UserProfile)] = [];
    private stable var collaborativeIdeasEntries: [(Text, CollaborativeIdea)] = [];

    private transient var ideas = Map.HashMap<Text, Idea>(100, Text.equal, Text.hash);
    private transient var userIdeas = Map.HashMap<Principal, [Text]>(50, Principal.equal, Principal.hash);
    private transient var userProfiles = Map.HashMap<Principal, UserProfile>(50, Principal.equal, Principal.hash);
    private transient var collaborativeIdeas = Map.HashMap<Text, CollaborativeIdea>(20, Text.equal, Text.hash);

    /* ===================== UPGRADE HOOKS ===================== */

    system func preupgrade() {
        ideasEntries := Iter.toArray(ideas.entries());
        userIdeasEntries := Iter.toArray(userIdeas.entries());
        userProfilesEntries := Iter.toArray(userProfiles.entries());
        collaborativeIdeasEntries := Iter.toArray(collaborativeIdeas.entries());
    };

    system func postupgrade() {
        ideas := Map.fromIter<Text, Idea>(ideasEntries.vals(), ideasEntries.size(), Text.equal, Text.hash);
        userIdeas := Map.fromIter<Principal, [Text]>(userIdeasEntries.vals(), userIdeasEntries.size(), Principal.equal, Principal.hash);
        userProfiles := Map.fromIter<Principal, UserProfile>(userProfilesEntries.vals(), userProfilesEntries.size(), Principal.equal, Principal.hash);
        collaborativeIdeas := Map.fromIter<Text, CollaborativeIdea>(collaborativeIdeasEntries.vals(), collaborativeIdeasEntries.size(), Text.equal, Text.hash);

        ideasEntries := [];
        userIdeasEntries := [];
        userProfilesEntries := [];
        collaborativeIdeasEntries := [];
    };

    /* ===================== HELPERS ===================== */

    private func isHighRisk(semantic: ?SemanticReport): Bool {
        switch (semantic) {
            case (?s) { s.risk == "HIGH" or s.risk == "High" };
            case null { false };
        }
    };

    private func generateProofHash(
        id: Text,
        title: Text,
        description: Text,
        creator: Principal,
        timestamp: Int
    ): Text {
        let content = id # title # description # Principal.toText(creator) # Int.toText(timestamp);
        let hash = Text.hash(content);
        "sha256:" # Nat32.toText(hash)
    };

    private func updateUserStats(user: Principal, isPublic: Bool): async () {
        switch (userProfiles.get(user)) {
            case null {
                userProfiles.put(user, {
                    principal = user;
                    username = null;
                    email = null;
                    createdAt = Time.now();
                    totalIdeas = 1;
                    publicIdeas = if (isPublic) 1 else 0;
                    reputation = if (isPublic) 10 else 5;
                });
            };
            case (?profile) {
                userProfiles.put(user, {
                    principal = profile.principal;
                    username = profile.username;
                    email = profile.email;
                    createdAt = profile.createdAt;
                    totalIdeas = profile.totalIdeas + 1;
                    publicIdeas = profile.publicIdeas + (if (isPublic) 1 else 0);
                    reputation = profile.reputation + (if (isPublic) 10 else 5);
                });
            };
        }
    };

    /* ===================== CORE LOGIC ===================== */

    public shared(msg) func submitIdea(input: IdeaInput): async Result.Result<Text, Text> {
        let caller = msg.caller;

        if (isHighRisk(input.semantic)) {
            return #err("Submission blocked: High semantic similarity detected");
        };

        if (Text.size(input.title) == 0 or Text.size(input.title) > 100) {
            return #err("Title must be between 1 and 100 characters");
        };

        if (Text.size(input.description) == 0 or Text.size(input.description) > 5000) {
            return #err("Description must be between 1 and 5000 characters");
        };

        let ideaId = "idea_" # Nat.toText(nextIdeaId);
        nextIdeaId += 1;

        let now = Time.now();

        let idea: Idea = {
            id = ideaId;
            title = input.title;
            description = input.description;
            creator = caller;
            timestamp = now;
            status = input.status;
            ipfsHash = input.ipfsHash;
            isRevealed = (input.status == #Public);
            revealTimestamp = if (input.status == #Public) ?now else null;
            proofHash = generateProofHash(ideaId, input.title, input.description, caller, now);
            version = 1;
            tags = input.tags;
            category = input.category;
            semantic = input.semantic;
        };

        ideas.put(ideaId, idea);

        let current = Option.get(userIdeas.get(caller), []);
        userIdeas.put(caller, Array.append(current, [ideaId]));

        await updateUserStats(caller, input.status == #Public);

        #ok(ideaId)
    };

    public shared(msg) func getUserIdeas(): async [Idea] {
        let ids = Option.get(userIdeas.get(msg.caller), []);
        Array.mapFilter<Text, Idea>(ids, func(id) { ideas.get(id) })
    };

    public query func getIdea(id: Text) : async Result.Result<Idea, Text> {
        switch(ideas.get(id)) {
            case (?idea) {
                // Optional: Only allow creator or public viewing? 
                // For now, we allow fetching if you have the ID.
                #ok(idea) 
            };
            case null { 
                #err("Idea not found with ID: " # id) 
            };
        }
    };

    public query func getStats(): async {
        totalIdeas: Nat;
        publicIdeas: Nat;
        totalUsers: Nat;
    } {
        let allIdeas = Iter.toArray(ideas.vals());
        {
            totalIdeas = allIdeas.size();
            publicIdeas = Array.filter<Idea>(allIdeas, func(i) { i.status == #Public }).size();
            totalUsers = Iter.toArray(userProfiles.vals()).size();
        }
    };


    public query func getPublicFeed(
        limit: ?Nat, 
        offset: ?Nat, 
        category: ?Text
    ) : async [Idea] {
        // 1. Convert Iter to Array
        let all = Iter.toArray(ideas.vals());
        
        // 2. Filter for Public only
        let publicIdeas = Array.filter<Idea>(all, func(i) { 
            switch(i.status) {
                case (#Public) true;
                case (_) false;
            }
        });

        // Note: For production, you need more efficient pagination
        // This is a basic implementation to make your frontend work
        publicIdeas
    };
}
