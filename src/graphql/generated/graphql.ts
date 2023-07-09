import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AccessCredential = {
  __typename?: 'AccessCredential';
  access_token: Scalars['String'];
};

export type AuthCredential = {
  __typename?: 'AuthCredential';
  access_token: Scalars['String'];
};

export enum Language {
  En = 'en',
  Ja = 'ja'
}

export type LocationInfo = {
  __typename?: 'LocationInfo';
  lat: Scalars['Float'];
  lon: Scalars['Float'];
};

export type LoginCredential = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  generateAccessToken: AccessCredential;
  login: AuthCredential;
  registerUser: UserInfo;
};


export type MutationLoginArgs = {
  credential: LoginCredential;
};


export type MutationRegisterUserArgs = {
  credential: RegisterUserInput;
};

export enum NormalizeType {
  Id = 'ID',
  Name = 'NAME'
}

export type NormalizedStopInfo = {
  __typename?: 'NormalizedStopInfo';
  key: Scalars['String'];
  name: Scalars['String'];
  stops: StopPagination;
};


export type NormalizedStopInfoStopsArgs = {
  options: StopSearchOption;
};

export type NormalizedStopPagination = {
  __typename?: 'NormalizedStopPagination';
  edges: Array<NormalizedStopInfo>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type NormalizedStopPaginationOptions = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type NormalizedStopSearchCondition = {
  key?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  remoteVersionUids: Array<Scalars['String']>;
};

export type NormalizedStopSearchOption = {
  groupBy: NormalizeType;
  languages: Array<Language>;
};

export enum Order {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type PageInfo = {
  __typename?: 'PageInfo';
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
};

export type PlatformInfo = {
  __typename?: 'PlatformInfo';
  code?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  findRemotes: RemotePagination;
  searchNormalizedStops: NormalizedStopPagination;
  timetable: TimetablePagination;
};


export type QueryFindRemotesArgs = {
  conditions: RemoteSearchConditions;
  pagination: RemotePaginationOptions;
};


export type QuerySearchNormalizedStopsArgs = {
  conditions: NormalizedStopSearchCondition;
  options: NormalizedStopSearchOption;
  pagination: NormalizedStopPaginationOptions;
};


export type QueryTimetableArgs = {
  conditions: TimetableSearch;
  pagination: TimetablePaginationOptions;
};

export type RegisterUserInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type RemoteInfo = {
  __typename?: 'RemoteInfo';
  name: Scalars['String'];
  uid: Scalars['String'];
  versions: VersionPagination;
};


export type RemoteInfoVersionsArgs = {
  order: VersionOrder;
  pagination: VersionPaginationOptions;
};

export type RemotePagination = {
  __typename?: 'RemotePagination';
  edges: Array<RemoteInfo>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type RemotePaginationOptions = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type RemoteSearchConditions = {
  name?: InputMaybe<Scalars['String']>;
  remoteUids?: InputMaybe<Array<Scalars['String']>>;
};

export type RouteInfo = {
  __typename?: 'RouteInfo';
  longName?: Maybe<Scalars['String']>;
  uid: Scalars['String'];
};

export type StopInfo = {
  __typename?: 'StopInfo';
  code?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  location: LocationInfo;
  name: Scalars['String'];
  platform?: Maybe<PlatformInfo>;
  timezone: Scalars['String'];
  uid: Scalars['String'];
  url?: Maybe<Scalars['String']>;
  wheelchairBoarding: WheelchairBoarding;
};

export type StopPagination = {
  __typename?: 'StopPagination';
  edges: Array<StopUnion>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type StopSearchOption = {
  languages: Array<Language>;
};

export type StopTimeArrivalInfo = {
  __typename?: 'StopTimeArrivalInfo';
  arrival: Time;
  departure?: Maybe<Time>;
  headsign?: Maybe<Scalars['String']>;
  route: RouteInfo;
  stop: StopUnion;
  uid: Scalars['String'];
};

export type StopTimeDepartureInfo = {
  __typename?: 'StopTimeDepartureInfo';
  arrival?: Maybe<Time>;
  departure: Time;
  headsign?: Maybe<Scalars['String']>;
  route: RouteInfo;
  stop: StopUnion;
  uid: Scalars['String'];
};

export type StopTimeInfo = {
  __typename?: 'StopTimeInfo';
  arrival: Time;
  departure: Time;
  headsign?: Maybe<Scalars['String']>;
  route: RouteInfo;
  stop: StopUnion;
  uid: Scalars['String'];
};

export type StopTimeUnion = StopTimeArrivalInfo | StopTimeDepartureInfo | StopTimeInfo;

export type StopUnion = StopInfo;

export enum SupportType {
  Agency = 'AGENCY',
  Attribution = 'ATTRIBUTION',
  Calendar = 'CALENDAR',
  CalendarDate = 'CALENDAR_DATE',
  FareAttribute = 'FARE_ATTRIBUTE',
  FareRule = 'FARE_RULE',
  FeedInfo = 'FEED_INFO',
  Frequencie = 'FREQUENCIE',
  Level = 'LEVEL',
  Pathway = 'PATHWAY',
  Route = 'ROUTE',
  Shape = 'SHAPE',
  Stop = 'STOP',
  StopTime = 'STOP_TIME',
  Transfer = 'TRANSFER',
  Translation = 'TRANSLATION',
  Trip = 'TRIP'
}

export type Time = {
  __typename?: 'Time';
  time: Scalars['String'];
};

export type TimetablePagination = {
  __typename?: 'TimetablePagination';
  edges: Array<Array<StopTimeUnion>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type TimetablePaginationOptions = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type TimetableSearch = {
  date: Scalars['String'];
  transitStopUids: Array<Array<Scalars['String']>>;
};

export type UserInfo = {
  __typename?: 'UserInfo';
  email: Scalars['String'];
};

export type VersionInfo = {
  __typename?: 'VersionInfo';
  created_at: Scalars['String'];
  data_portal_url: Scalars['String'];
  realtime_data_urls: Array<Scalars['String']>;
  static_data_url: Scalars['String'];
  support_types: Array<SupportType>;
  uid: Scalars['String'];
};

export type VersionOrder = {
  column?: InputMaybe<VersionOrderColumn>;
  order?: InputMaybe<Order>;
};

export enum VersionOrderColumn {
  CreatedAt = 'CREATED_AT'
}

export type VersionPagination = {
  __typename?: 'VersionPagination';
  edges: Array<VersionInfo>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type VersionPaginationOptions = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export enum WheelchairBoarding {
  Accessible = 'ACCESSIBLE',
  NoAccessible = 'NO_ACCESSIBLE',
  NoInformation = 'NO_INFORMATION'
}

export type RemotesQueryVariables = Exact<{
  where: RemoteSearchConditions;
  pagination: RemotePaginationOptions;
  versionsPagination: VersionPaginationOptions;
  versionOrder: VersionOrder;
}>;


export type RemotesQuery = { __typename?: 'Query', findRemotes: { __typename?: 'RemotePagination', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean }, edges: Array<{ __typename?: 'RemoteInfo', versions: { __typename?: 'VersionPagination', edges: Array<{ __typename?: 'VersionInfo', uid: string }> } }> } };

export type NormalizedStopsQueryVariables = Exact<{
  pagination: NormalizedStopPaginationOptions;
  where: NormalizedStopSearchCondition;
  options: NormalizedStopSearchOption;
  stopsOptions: StopSearchOption;
}>;


export type NormalizedStopsQuery = { __typename?: 'Query', searchNormalizedStops: { __typename?: 'NormalizedStopPagination', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasPreviousPage: boolean, hasNextPage: boolean }, edges: Array<{ __typename?: 'NormalizedStopInfo', key: string, name: string, stops: { __typename?: 'StopPagination', edges: Array<{ __typename?: 'StopInfo', uid: string, id: string, name: string }> } }> } };

export type TimetableForBetweenStopsQueryVariables = Exact<{
  conditions: TimetableSearch;
  pagination: TimetablePaginationOptions;
}>;


export type TimetableForBetweenStopsQuery = { __typename?: 'Query', timetable: { __typename?: 'TimetablePagination', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasPreviousPage: boolean, hasNextPage: boolean }, edges: Array<Array<{ __typename?: 'StopTimeArrivalInfo', uid: string, headsign?: string | null, route: { __typename?: 'RouteInfo', uid: string, longName?: string | null }, a_departure?: { __typename?: 'Time', time: string } | null } | { __typename?: 'StopTimeDepartureInfo', uid: string, headsign?: string | null, route: { __typename?: 'RouteInfo', uid: string, longName?: string | null }, d_departure: { __typename?: 'Time', time: string } } | { __typename?: 'StopTimeInfo', uid: string, headsign?: string | null, route: { __typename?: 'RouteInfo', uid: string, longName?: string | null }, departure: { __typename?: 'Time', time: string } }>> } };


export const RemotesDocument = gql`
    query Remotes($where: RemoteSearchConditions!, $pagination: RemotePaginationOptions!, $versionsPagination: VersionPaginationOptions!, $versionOrder: VersionOrder!) {
  findRemotes(conditions: $where, pagination: $pagination) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    edges {
      versions(pagination: $versionsPagination, order: $versionOrder) {
        edges {
          uid
        }
      }
    }
  }
}
    `;

export function useRemotesQuery(options: Omit<Urql.UseQueryArgs<RemotesQueryVariables>, 'query'>) {
  return Urql.useQuery<RemotesQuery, RemotesQueryVariables>({ query: RemotesDocument, ...options });
};
export const NormalizedStopsDocument = gql`
    query NormalizedStops($pagination: NormalizedStopPaginationOptions!, $where: NormalizedStopSearchCondition!, $options: NormalizedStopSearchOption!, $stopsOptions: StopSearchOption!) {
  searchNormalizedStops(
    pagination: $pagination
    conditions: $where
    options: $options
  ) {
    totalCount
    pageInfo {
      hasPreviousPage
      hasNextPage
    }
    edges {
      key
      name
      stops(options: $stopsOptions) {
        edges {
          ... on StopInfo {
            uid
            id
            name
          }
        }
      }
    }
  }
}
    `;

export function useNormalizedStopsQuery(options: Omit<Urql.UseQueryArgs<NormalizedStopsQueryVariables>, 'query'>) {
  return Urql.useQuery<NormalizedStopsQuery, NormalizedStopsQueryVariables>({ query: NormalizedStopsDocument, ...options });
};
export const TimetableForBetweenStopsDocument = gql`
    query TimetableForBetweenStops($conditions: TimetableSearch!, $pagination: TimetablePaginationOptions!) {
  timetable(conditions: $conditions, pagination: $pagination) {
    totalCount
    pageInfo {
      hasPreviousPage
      hasNextPage
    }
    edges {
      ... on StopTimeArrivalInfo {
        uid
        headsign
        route {
          uid
          longName
        }
        a_departure: departure {
          time
        }
      }
      ... on StopTimeDepartureInfo {
        uid
        headsign
        route {
          uid
          longName
        }
        d_departure: departure {
          time
        }
      }
      ... on StopTimeInfo {
        uid
        headsign
        route {
          uid
          longName
        }
        departure {
          time
        }
      }
    }
  }
}
    `;

export function useTimetableForBetweenStopsQuery(options: Omit<Urql.UseQueryArgs<TimetableForBetweenStopsQueryVariables>, 'query'>) {
  return Urql.useQuery<TimetableForBetweenStopsQuery, TimetableForBetweenStopsQueryVariables>({ query: TimetableForBetweenStopsDocument, ...options });
};