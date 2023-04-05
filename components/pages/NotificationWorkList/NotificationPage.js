import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  useWindowDimensions,
  Platform,
} from "react-native";
import {
  TextInput,
  Button,
  Switch,
  List,
  ActivityIndicator,
} from "react-native-paper";
import axios from "axios";
import {
  iframeModel,
  HTMLIframe,
  useHtmlIframeProps,
} from "@native-html/iframe-plugin";
import { WebView } from "react-native-webview";
import { useForm, Controller } from "react-hook-form";
import RenderHtml, {
  HTMLContentModel,
  defaultHTMLElementModels,
} from "react-native-render-html";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

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
  img: defaultHTMLElementModels.img.extend({
    contentModel: HTMLContentModel.mixed,
  }),
};

const NotificationPage = (props) => {
  const [data, setData] = useState({});
  const [actions, setActions] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  const { width } = useWindowDimensions();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({ mode: "onSubmit" });

  const handleButtonPressed = (submitData, method, url, label) => {
    if (!isButtonPressed) {
      setIsButtonPressed(true);
      switch (method) {
        case "post":
          axios
            .post(
              url,
              {},
              {
                params: {
                  nid: data.notification_id,
                  APPV_GROUP_ID: data.approval_group_id,
                  RESPOND_COMMENT: submitData.comments,
                  RESPONDER: data.to_role_id,
                  action_source: label,
                  P_ACTIVITY_INSTANCE_ID: data.activity_instance_id,
                },
              }
            )
            .then((res) => {
              alert(res.data.STATUS);
              setIsButtonPressed(false);
              props.navigation.navigate("NotificationWorkListHome");
            })
            .catch((err) => {
              console.log(err);
              alert("Something went wrong");
              setIsButtonPressed(false);
            });
          break;
      }
    }
  };

  const handleDownload = async (file_name, url, public_url, doc_content_id) => {
    //prevent from double clicking
    if (!isButtonPressed) {
      setIsButtonPressed(true);
      //location where the file will be saved in the app data
      const fileUri = `${FileSystem.documentDirectory}${file_name}`;
      //download the file from url to the above location
      const downloadedFile = await FileSystem.downloadAsync(url, fileUri);
      if (downloadedFile.status != 200) {
        console.log("couldn't download the file");
        alert("Couldn't download the file");
        setIsButtonPressed(false);
      }
      if (Platform.OS === "ios") {
        //open share window for iOS to handle what to do with the file
        const shareResult = await Sharing.shareAsync(fileUri);
        setIsButtonPressed(false);
      } else {
        //for andriod get permission to access directory
        try {
          // Request permission to access the media library
          const { status } = await MediaLibrary.requestPermissionsAsync();
          if (status !== "granted") {
            alert("Permission to access media library denied");
            setIsButtonPressed(false);
            return;
          }

          // Create asset for the downloaded file
          const asset = await MediaLibrary.createAssetAsync(fileUri);

          // Get folder "HitsDownloads"
          const album = await MediaLibrary.getAlbumAsync("HitsDownloads");

          // Check if it exists
          if (album == null) {
            // Create new folder if it doesn't exist and add the downloaded file
            await MediaLibrary.createAlbumAsync("HitsDownloads", asset, false);
          } else {
            // Add downloaded file
            await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
          }
          setIsButtonPressed(false);
        } catch (error) {
          console.log(error);
          alert("Error saving to downloads");
          setIsButtonPressed(false);
        }
      }
    }
  };
  useEffect(() => {
    axios
      .get(
        "https://eg32mvlk9thcnja-dev.adb.uk-london-1.oraclecloudapps.com/ords/hits_dev/ssmb/get_todo_notifications",
        {
          params: {
            p_requester_id: null,
            p_view: null,
            p_notification_id: props.route.params.notification_id,
          },
        }
      )
      .then((res) => {
        setData(res.data.data[0]);
        console.log(res.data);
        setActions(res.data.actions);
        setAttachments(res.data.attachments);
        //reset(res.data.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return JSON.stringify(data) === "{}" ? (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator animating={true} color="#2E3B55" />
    </View>
  ) : (
    <KeyboardAwareScrollView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              justifyContent: "flex-start",
              alignItems: "stretch",
            }}
          >
            <Controller
              control={control}
              name="subject"
              defaultValue={data.subject}
              render={({ field: { onChange, value, onBlur } }) => (
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    textAlign: "center",
                    marginTop: "5%",
                  }}
                >
                  {data.subject}
                </Text>
                // <TextInput
                //   style={{ marginTop: "5%" }}
                //   mode="outlined"
                //   label="Subject"
                //   value={data.subject}
                //   editable="false"
                //   onChangeText={(value) => {
                //     onChange(value);
                //   }}
                //   multiline={true}
                // />
              )}
            />
            <List.Accordion
              title="WorkFlow Transaction Details"
              titleStyle={{
                textAlign: "center",
              }}
              style={{ marginTop: "5%" }}
            >
              <Controller
                control={control}
                name="notification_date"
                defaultValue={data.notification_date}
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    style={{ marginTop: "5%" }}
                    mode="outlined"
                    label="Sent Date"
                    value={new Date(
                      data.notification_date
                    ).toLocaleDateString()}
                    editable="false"
                    onChangeText={(value) => {
                      onChange(value);
                    }}
                  />
                )}
              />
              <Controller
                control={control}
                name="transaction_type"
                defaultValue={data.transaction_type}
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    style={{ marginTop: "5%" }}
                    mode="outlined"
                    label="Transaction Type"
                    value={data.transaction_type}
                    editable="false"
                    onChangeText={(value) => {
                      onChange(value);
                    }}
                  />
                )}
              />
              <Controller
                control={control}
                name="transaction_id"
                defaultValue={data.transaction_id}
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    style={{ marginTop: "5%" }}
                    mode="outlined"
                    label="Transaction#"
                    value={"" + data.transaction_id}
                    editable="false"
                    onChangeText={(value) => {
                      onChange(value);
                    }}
                  />
                )}
              />
              <Controller
                control={control}
                name="from_role_name"
                defaultValue={data.from_role_name}
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    style={{ marginTop: "5%" }}
                    mode="outlined"
                    label="From"
                    value={data.from_role_name}
                    editable="false"
                    onChangeText={(value) => {
                      onChange(value);
                    }}
                  />
                )}
              />
              <Controller
                control={control}
                name="to_role_name"
                defaultValue={data.to_role_name}
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    style={{ marginTop: "5%" }}
                    mode="outlined"
                    label="To"
                    value={data.to_role_name}
                    editable="false"
                    onChangeText={(value) => {
                      onChange(value);
                    }}
                  />
                )}
              />
            </List.Accordion>
            <List.Accordion
              title="Content Body"
              titleStyle={{
                textAlign: "center",
              }}
              style={{ marginTop: "5%" }}
            >
              {(() => {
                switch (data.content_type) {
                  case "Rich Text":
                    return (
                      <Controller
                        control={control}
                        name="ntfy_body"
                        defaultValue={data.ntfy_body}
                        render={({ field: { onChange, value, onBlur } }) => (
                          <View style={{ marginTop: "5%" }}>
                            <RenderHtml
                              contentWidth={width}
                              source={{ html: data.ntfy_body }}
                            />
                          </View>
                        )}
                      />
                    );
                  case "HTML":
                    return (
                      <Controller
                        control={control}
                        name="ntfy_body"
                        defaultValue={data.ntfy_body}
                        render={({ field: { onChange, value, onBlur } }) => (
                          <View style={{ marginTop: "5%" }}>
                            <RenderHtml
                              contentWidth={width}
                              source={{ html: data.ntfy_body }}
                            />
                          </View>
                        )}
                      />
                    );
                  case "External Form":
                    return (
                      <Controller
                        control={control}
                        name="ntfy_body"
                        defaultValue={data.ntfy_body}
                        render={({ field: { onChange, value, onBlur } }) => (
                          <RenderHtml
                            renderers={renderers}
                            contentWidth={width}
                            WebView={WebView}
                            source={{
                              html: data.ntfy_body,
                            }}
                            customHTMLElementModels={customHTMLElementModels}
                          />
                        )}
                      />
                    );
                }
              })()}
              {/* <Controller
                control={control}
                name="test"
                defaultValue={data.ntfy_body}
                render={({ field: { onChange, value, onBlur } }) => (
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
                )}
              /> */}
              <Controller
                control={control}
                name="comments"
                defaultValue={data.comments}
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    style={{ marginTop: "5%" }}
                    mode="outlined"
                    label="Comments"
                    value={value ? value : data.comments}
                    onChangeText={(value) => {
                      onChange(value);
                    }}
                    multiline={true}
                  />
                )}
              />
            </List.Accordion>
            <List.Accordion
              title="Action History"
              titleStyle={{
                textAlign: "center",
              }}
              style={{ marginTop: "5%" }}
            ></List.Accordion>
            <List.Accordion
              title="Attachments"
              titleStyle={{
                textAlign: "center",
              }}
              style={{ marginTop: "5%" }}
            >
              {attachments.map((attachment, i) => {
                return (
                  <View
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      key={i}
                      style={{ width: "80%", marginTop: "1%" }}
                      mode="contained"
                      color="#2E3B55"
                      onPress={() =>
                        handleDownload(
                          attachment.file_name,
                          attachment.url,
                          attachment.public_url,
                          attachment.doc_content_id
                        )
                      }
                    >
                      {attachment.file_name}
                    </Button>
                  </View>
                );
              })}
            </List.Accordion>
            {actions.map((action, i) => {
              return (
                <Button
                  key={i}
                  style={{ marginTop: "1%" }}
                  mode="contained"
                  color="#2E3B55"
                  onPress={handleSubmit((data) =>
                    handleButtonPressed(
                      data,
                      action.method,
                      action.url,
                      action.label
                    )
                  )}
                >
                  {action.label}
                </Button>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

export default NotificationPage;
