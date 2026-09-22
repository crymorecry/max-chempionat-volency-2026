export {};

declare global {
  interface Window {
    WebApp?: {
      shareMaxContent(params: {
        text?: string;
        link?: string;
      }): Promise<unknown> | void;

      openMaxLink(url: string): void;

      initData: string;

      initDataUnsafe: {
        start_param?: string;
        user?: {
          id: number;
          first_name?: string;
          last_name?: string;
          username?: string;
        };
      };
    };
  }
}