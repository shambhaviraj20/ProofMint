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
export type Result = { 'ok' : string } |
  { 'err' : string };
export interface SemanticReport { 'risk' : string, 'score' : bigint }
export interface _SERVICE {
  'getPublicFeed' : ActorMethod<
    [[] | [bigint], [] | [bigint], [] | [string]],
    Array<Idea>
  >,
  'getStats' : ActorMethod<
    [],
    { 'publicIdeas' : bigint, 'totalUsers' : bigint, 'totalIdeas' : bigint }
  >,
  'getUserIdeas' : ActorMethod<[], Array<Idea>>,
  'submitIdea' : ActorMethod<[IdeaInput], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
