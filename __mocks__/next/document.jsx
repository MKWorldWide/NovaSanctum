import React from 'react';

// Mock Document component
export class Document extends React.Component {
  static async getInitialProps(ctx) {
    const initialProps = {
      html: '',
      head: [],
      styles: [],
    };
    
    if (ctx && ctx.renderPage) {
      await ctx.renderPage();
    }
    
    return initialProps;
  }

  render() {
    return (
      <html>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {this.props.head}
          {this.props.styles}
        </head>
        <body>
          <div id="__next">
            {this.props.children}
          </div>
          <script src="/_next/static/chunks/main.js" />
        </body>
      </html>
    );
  }
}

// Mock Head component
export class Head extends React.Component {
  render() {
    return (
      <head>
        {this.props.children}
      </head>
    );
  }
}

// Mock Main component
export class Main extends React.Component {
  render() {
    return <div id="__next">{this.props.children}</div>;
  }
}

// Mock NextScript component
export class NextScript extends React.Component {
  render() {
    return (
      <>
        <script src="/_next/static/chunks/main.js" />
        {this.props.children}
      </>
    );
  }
}

// Mock Html component
export class Html extends React.Component {
  render() {
    return (
      <html {...this.props}>
        {this.props.children}
      </html>
    );
  }
}

// Mock Body component
export class Body extends React.Component {
  render() {
    return <body {...this.props} />;
  }
}

// Mock the default export
export default Document;
