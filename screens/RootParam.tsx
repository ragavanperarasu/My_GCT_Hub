export type RootStackParamList = {
  StudentHome: undefined;
  StudentLogin:undefined;
  SubShow:{reqType : string, regType : string , depType : string, semType : string, access: string};
  BooksShow:{reqType : string, regType : string , depType : string, semType : string, access: string};
  UtSubShow:{reqType : string, regType : string , depType : string, semType : string, access: string};
  UttSubShow:{reqType : string, regType : string , depType : string, semType : string, access: string};
  StuNoteShow:{reqType : string, regType : string , depType : string, semType : string, access: string};
  YoutubeShow:{reqType : string, regType : string , depType : string, semType : string};
  TimetableShow:{reqType : string, regType : string , depType : string, semType : string, access: string};
  SyllShow:{reqType : string, regType : string , depType : string, semType : string, access: string};
  About: undefined;
  Sabout: undefined;
  WebViewShow: {url : string};
  YouShow: {url : string};
  WebViewSave: {url : string};
  Alumine: undefined;
  Search: undefined;
  UserLogin:undefined;
  CreateNewAccount: undefined;

  UploadSemqus: {subname: string};
  UploadUtoqus: {subname: string};
  UploadUttqus: {subname: string};
  UploadBooks: {subname: string};
  UploadNotes: {subname: string};
  UploadSyll: {subname: string};
  UploadTtable: {subname: string};

  Showcomments: {com: string, subname:string, postdate:string, sendurl: string};
  UploaddAlumin: undefined;
  Dir: undefined;
  Att: undefined;
  Attcreate: undefined;
  Insertatt:{data:object}
  Attview:{data:object}
  Pinenter: {data:object, ftype: String}
};