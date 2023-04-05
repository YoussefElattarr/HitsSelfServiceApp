// import { SafeAreaView, StyleSheet, Text, View } from "react-native";
// import React from "react";
// import WebView from "react-native-webview";

// const WebViewPage = () => {
//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <WebView
//         source={{
//           html: `<!DOCTYPE html>
//       <html>
//       <body>
      
//       <h1>The iframe element</h1>
      
//       <iframe width="100%" height="315"
//           src="https://www.youtube.com/embed/M_xq5YB0z-A">
//       </iframe>
      
//       </body>
//       </html>`,
//         }}
//       />
//     </SafeAreaView>
//   );
// };

// export default WebViewPage;

import React from 'react';
import { View, ScrollView, useWindowDimensions } from 'react-native';
import { List } from 'react-native-paper';
import RenderHtml, {
  HTMLContentModel,
  defaultHTMLElementModels,
} from 'react-native-render-html';
import { WebView } from 'react-native-webview';
import {
  iframeModel,
  HTMLIframe,
  useHtmlIframeProps,
} from '@native-html/iframe-plugin';

const IframeRenderer = function IframeRenderer(props) {
  const iframeProps = useHtmlIframeProps(props);
  const { width, height } = iframeProps.style;
  return (
    <View style={{ width, height }}>
      <HTMLIframe {...iframeProps} />
    </View>
  );
};

const renderers = {
  iframe: IframeRenderer,
};

const customHTMLElementModels = {
  iframe: iframeModel.extend({
    contentModel: HTMLContentModel.mixed,
  }),
};

const WebViewPage = () => {
  const { width } = useWindowDimensions();

  return (
    <ScrollView>
      <List.Section>
        <List.Subheader>My List</List.Subheader>
        <List.Accordion
          title="Accordion Title"
          description="Accordion Description"
        >
          <List.Item
            title="List Item Title"
            description="List Item Description"
          />
          <List.Item
            title="List Item Title"
            description="List Item Description"
          />
          <List.Item
            title="List Item Title"
            description="List Item Description"
          />
        </List.Accordion>
        <List.Item title="WebViews" />
        <List.Accordion>
          <RenderHtml
            renderers={renderers}
            contentWidth={width}
            WebView={WebView}
            source={{
              html: `<!DOCTYPE html>
                      <html>
                        <body>
                          <h1>The iframe element</h1>
                          <iframe
                            width="100%"
                            height="315"
                            src="https://www.youtube.com/embed/M_xq5YB0z-A"
                          ></iframe>
                        </body>
                      </html>`,
            }}
            customHTMLElementModels={customHTMLElementModels}
          />
        </List.Accordion>
      </List.Section>
    </ScrollView>
  );
};

export default WebViewPage;

