import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Idea {
  'id' : string,
  'status' : IdeaStatus,
  'title' : string,
  'creator' : Principal,
  'proofHash' : string,
  'tags' : Array<string>,
  'description' : string,
  'revealTimestamp' : [] | [bigint],
  'version' : bigint,
  'timestamp' : bigint,
  'category' : string,
  'semantic' : [] | [SemanticReport],
  'ipfsHash' : [] | [string],
  'isRevealed' : boolean,
}
export interface IdeaInput {
  'status' : IdeaStatus,
  'title' : string,
  'tags' : Array<string>,
  'description' : string,
  'category' : string,
  'semantic' : [] | [SemanticReport],
  'ipfsHash' : [] | [string],
}
export type IdeaStatus = { 'Private' : null } |
  { 'Public' : null } |
  { 'RevealLater' : null };
export interface ProofRecord {
  'creator' : Principal,
  'proofHash' : string,
  'network' : string,
  'isVerified' : boolean,
  'blockHeight' : bigint,
  'timestamp' : bigint,
  'ideaId' : string,
  'canisterId' : string,
}
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : string } |
  { 'err' : string };
export type Result_2 = { 'ok' : UserProfile } |
  { 'err' : string };
export type Result_3 = { 'ok' : ProofRecord } |
  { 'err' : string };
export type Result_4 = { 'ok' : Idea } |
  { 'err' : string };
export interface SemanticReport { 'risk' : string, 'score' : bigint }
export interface UserProfile {
  'principal' : Principal,
  'publicIdeas' : bigint,
  'username' : [] | [string],
  'createdAt' : bigint,
  'reputation' : bigint,
  'email' : [] | [string],
  'totalIdeas' : bigint,
}
export interface _SERVICE {
  'createCollaborativeIdea' : ActorMethod<
    [string, Array<Principal>, bigint],
    Result
  >,
  'createUserProfile' : ActorMethod<[[] | [string], [] | [string]], Result_2>,
  'getIdea' : ActorMethod<[string], Result_4>,
  'getProofRecord' : ActorMethod<[string], Result_3>,
  'getPublicFeed' : ActorMethod<
    [[] | [bigint], [] | [string], Array<string>],
    Array<Idea>
  >,
  'getStats' : ActorMethod<
    [],
    { 'publicIdeas' : bigint, 'totalUsers' : bigint, 'totalIdeas' : bigint }
  >,
  'getUserIdeas' : ActorMethod<[], Array<Idea>>,
  'getUserProfile' : ActorMethod<[], Result_2>,
  'revealIdea' : ActorMethod<[string], Result>,
  'searchIdeas' : ActorMethod<[string, [] | [bigint]], Array<Idea>>,
  'signCollaborativeIdea' : ActorMethod<[string], Result>,
  'submitIdea' : ActorMethod<[IdeaInput], Result_1>,
  'updateIdea' : ActorMethod<[string, string, Array<string>], Result>,
  'verifyIdea' : ActorMethod<[string, string], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
