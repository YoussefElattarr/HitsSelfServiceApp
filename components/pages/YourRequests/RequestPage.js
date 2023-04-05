import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  TextInput,
  Button,
  Switch,
  ActivityIndicator,
} from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import DateTimePicker from "@react-native-community/datetimepicker";
import SelectDropdown from "react-native-select-dropdown";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

let count = 0;

const YourRequest = (props) => {
  const [metaData, setMetaData] = useState([]);
  const [data, setData] = useState({});
  const [actions, setActions] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const [dropDownData, setDropDownData] = useState({});
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onSubmit" });

  useEffect(() => {
    axios
      .get(
        "https://eg32mvlk9thcnja-dev.adb.uk-london-1.oraclecloudapps.com/ords/hits_dev/ssmb/request",
        {
          params: {
            p_person_id: null,
            p_requester_id: null,
            p_request_id: props.route.params.request_id,
          },
        }
      )
      .then((res) => {
        console.log(res.data.data);
        setIsPending(res.data.data[0].status === "Pending" ? true : false);
        setData(res.data.data[0]);
        setActions(res.data.actions);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(
        "https://eg32mvlk9thcnja-dev.adb.uk-london-1.oraclecloudapps.com/ords/hits_dev/ssmb/request_metadata",
        {
          params: {
            p_person_id: null,
            p_requester_id: null,
            p_request_type_id: props.route.params.request_type_id,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        let arr = res.data;
        //sort depending on sequence number
        arr.sort((a, b) => {
          if (a.SEQUENCE_NUM < b.SEQUENCE_NUM) return -1;
          if (a.SEQUENCE_NUM > b.SEQUENCE_NUM) return 1;
          return 0;
        });
        setMetaData(arr);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleButtonPressed = (data, method, url) => {
    if (!isButtonPressed) {
      setIsButtonPressed(true);
      switch (method) {
        case "put":
          let res = {
            request_type_id: props.route.params.request_id,
            flex_field: {},
          };
          for (let x in data) {
            if (
              x !== "request_type" &&
              x !== "request_date" &&
              x !== "person_id"
            ) {
              if (data[x] === undefined) res["flex_field"][x] = null;
              else {
                if (data[x] instanceof Date) {
                  //return date only without timestamp in YYYY-MM-DD format
                  const offset = data[x].getTimezoneOffset();
                  data[x] = new Date(data[x].getTime() - offset * 60 * 1000);
                  res["flex_field"][x] = data[x].toISOString().split("T")[0];
                } else res["flex_field"][x] = data[x];
              }
            } else {
              if (data[x] === undefined) res[x] = null;
              else {
                res[x] = data[x];
                if (x === "request_date") {
                  //return date only without timestamp in YYYY-MM-DD format
                  const offset = data[x].getTimezoneOffset();
                  data[x] = new Date(data[x].getTime() - offset * 60 * 1000);
                  res[x] = data[x].toISOString().split("T")[0];
                }
              }
            }
          }
          console.log(res);
          axios
            .put(url, res, {
              params: {
                p_person_id: null,
                p_requester_id: null,
                p_request_id: props.route.params.request_id,
              },
            })
            .then((res) => {
              console.log(res.data);
              alert("Success");
              setIsButtonPressed(false);
              props.navigation.navigate("YourRequestsHome");
            })
            .catch((err) => {
              console.log(err);
              alert("Something went wrong");
              setIsButtonPressed(false);
            });
          break;
        case "post":
          axios
            .post(
              url,
              {},
              {
                params: {
                  p_person_id: null,
                  p_requester_id: null,
                  p_request_id: props.route.params.request_id,
                },
              }
            )
            .then((res) => {
              console.log(res.data);
              alert(res.data.STATUS);
              setIsButtonPressed(false);
              props.navigation.navigate("YourRequestsHome");
            })
            .catch((err) => {
              console.log(err);
              alert("Something went wrong");
              setIsButtonPressed(false);
            });
          break;
        case "delete":
          axios
            .delete(url, {
              params: {
                p_person_id: null,
                p_requester_id: null,
                p_request_id: props.route.params.request_id,
              },
            })
            .then((res) => {
              console.log(res.data);
              alert(res.data.STATUS);
              setIsButtonPressed(false);
              props.navigation.navigate("YourRequestsHome");
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
  return JSON.stringify(data) === "{}" || metaData.length === 0 ? (
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
    <KeyboardAwareScrollView style={{}}>
      <SafeAreaView>
        <ScrollView>
          <Controller
            control={control}
            name="request_type"
            defaultValue={data.request_type}
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                style={{ marginTop: "5%" }}
                mode="outlined"
                label="Request Type"
                value={data.request_type_name}
                editable={false}
                onChangeText={(value) => {
                  onChange(value);
                  console.log(value);
                }}
              />
            )}
            rules={{
              required: {
                value: true,
                message: "Field is required!",
              },
            }}
          />
          <Controller
            control={control}
            name="request_date"
            defaultValue={new Date(data.request_date.slice(0, 10))}
            render={({ field: { onChange, value, onBlur } }) => (
              <>
                <Text style={{ marginTop: "5%" }}> Request Date</Text>
                {Platform.OS === "ios"
                  ? false
                  : true && (
                      <Button
                        disabled={isPending ? false : true}
                        onPress={() => setShowDateTimePicker(true)}
                      >
                        Open Date Picker
                      </Button>
                    )}
                {(Platform.OS === "ios" ? true : showDateTimePicker) && (
                  <DateTimePicker
                    mode="date"
                    disabled={isPending ? false : true}
                    value={
                      value ? value : new Date(data.request_date.slice(0, 10))
                    }
                    onChange={(value, selectedDate) => {
                      onChange(selectedDate);
                    }}
                    style={{ alignItems: "flex-start", marginRight: "35%" }}
                  />
                )}
              </>
            )}
            rules={{
              required: {
                value: true,
                message: "Field is required!",
              },
            }}
          />
          <Controller
            control={control}
            name="person_id"
            defaultValue={data.person_id}
            render={({ field: { onChange, value, onBlur } }) => (
              <>
                <Text style={{ marginTop: "5%" }}>Choose an Employee</Text>
                <SelectDropdown
                  data={[
                    {
                      label: "Test1",
                      value: 1,
                    },
                    {
                      label: "Test2",
                      value: 2,
                    },
                  ]}
                  onSelect={(selectedItem, index) => {
                    onChange(selectedItem.value);
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem.label;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item.label;
                  }}
                  //defaultValueByIndex={0}
                  disabled={isPending ? false : true}
                  defaultValue={{ value: data.person_id }}
                  defaultButtonText="Choose a different option"
                  search={true}
                  buttonStyle={{ width: "100%" }}
                />
              </>
            )}
            rules={{
              required: {
                value: true,
                message: "Field is required!",
              },
            }}
          />
          {metaData.map((d, i) => {
            if (d.DISPLAYED_FLAG === "Y")
              switch (d.DATA_TYPE) {
                case "TEXTFIELD":
                  return (
                    <Controller
                      key={i}
                      control={control}
                      name={d.API_NAME}
                      defaultValue={data["flex_field"][d.API_NAME]}
                      render={({ field: { onChange, value, onBlur } }) => (
                        <TextInput
                          style={{ marginTop: "5%" }}
                          mode="outlined"
                          label={d.LABEL}
                          editable={isPending ? true : false}
                          value={
                            value
                              ? value
                              : data["flex_field"][d.API_NAME]
                          }
                          onChangeText={(value) => {
                            onChange(value);
                          }}
                        />
                      )}
                      rules={{
                        required: {
                          value: d.REQUIRED_FLAG === "Y" ? true : false,
                          message: "Field is required!",
                        },
                      }}
                    />
                  );
                case "TEXTAREA":
                  return (
                    <Controller
                      key={i}
                      control={control}
                      name={d.API_NAME}
                      defaultValue={data["flex_field"][d.API_NAME]}
                      render={({ field: { onChange, value, onBlur } }) => (
                        <>
                          <TextInput
                            style={{ marginTop: "5%" }}
                            mode="outlined"
                            label={d.LABEL}
                            editable={isPending ? true : false}
                            value={
                              value
                                ? value
                                : data["flex_field"][d.API_NAME]
                            }
                            multiline={true}
                            onChangeText={(value) => {
                              onChange(value);
                            }}
                          />
                          {/* <ErrorMessage
                          errors={errors}
                          name="singleErrorInput"
                          render={({ message }) => <p>{message}</p>}
                        /> */}
                        </>
                      )}
                      rules={{
                        required: {
                          value: d.REQUIRED_FLAG === "Y" ? true : false,
                          message: "Field is required!",
                        },
                      }}
                    />
                  );
                case "DATE_PICKER":
                  return (
                    <Controller
                      key={i}
                      control={control}
                      name={d.API_NAME}
                      defaultValue={
                        new Date(data["flex_field"][d.API_NAME])
                      }
                      render={({ field: { onChange, value, onBlur } }) => (
                        <>
                          <Text style={{ marginTop: "5%" }}>{d.LABEL}</Text>
                          {Platform.OS === "ios"
                            ? false
                            : true && (
                                <Button
                                  disabled={isPending ? false : true}
                                  onPress={() => setShowDateTimePicker(true)}
                                >
                                  Open Date Picker
                                </Button>
                              )}
                          {(Platform.OS === "ios"
                            ? true
                            : showDateTimePicker) && (
                            <DateTimePicker
                              mode="date"
                              disabled={isPending ? false : true}
                              value={
                                value
                                  ? value
                                  : new Date(
                                      data["flex_field"][d.API_NAME]
                                    )
                              }
                              onChange={(value, selectedDate) => {
                                onChange(selectedDate);
                              }}
                              style={{
                                alignItems: "flex-start",
                                marginRight: "35%",
                              }}
                            />
                          )}
                        </>
                      )}
                      rules={{
                        required: {
                          value: d.REQUIRED_FLAG === "Y" ? true : false,
                          message: "Field is required!",
                        },
                      }}
                    />
                  );
                case "SELECT_LIST":
                  if (dropDownData[d.API_NAME] === undefined)
                    axios
                      .get(
                        "https://eg32mvlk9thcnja-dev.adb.uk-london-1.oraclecloudapps.com/ords/hits_dev/ssmb/get_lov",
                        {
                          params: {
                            p_lov_name: d.LOV_NAME,
                            p_cascading_var: null,
                          },
                        }
                      )
                      .then((response) => {
                        setDropDownData({
                          [d.API_NAME]: { value: response.data },
                        });
                      })
                      .catch((error) => {
                        console.error(error);
                      });
                  return (
                    <Controller
                      key={i}
                      control={control}
                      name={d.API_NAME}
                      defaultValue={data["flex_field"][d.API_NAME]}
                      render={({ field: { onChange, value, onBlur } }) => (
                        <>
                          <Text style={{ marginTop: "5%" }}>{d.LABEL}</Text>
                          <SelectDropdown
                            data={
                              dropDownData[d.API_NAME]
                                ? dropDownData[d.API_NAME].value
                                : []
                            }
                            onSelect={(selectedItem, index) => {
                              onChange(selectedItem.value);
                            }}
                            defaultButtonText="Choose a different option"
                            defaultValue={{
                              value: data["flex_field"][d.API_NAME],
                            }}
                            disabled={isPending ? false : true}
                            buttonTextAfterSelection={(selectedItem, index) => {
                              return selectedItem.label;
                            }}
                            rowTextForSelection={(item, index) => {
                              return item.label;
                            }}
                            search={true}
                            buttonStyle={{ width: "100%" }}
                          />
                        </>
                      )}
                      rules={{
                        required: {
                          value: d.REQUIRED_FLAG === "Y" ? true : false,
                          message: "Field is required!",
                        },
                      }}
                    />
                  );
                case "SWITCH":
                  return (
                    <Controller
                      key={i}
                      control={control}
                      name={d.API_NAME}
                      defaultValue={data["flex_field"][d.API_NAME]}
                      render={({ field: { onChange, value, onBlur } }) => (
                        <>
                          <Text style={{ marginTop: "5%" }}>{d.LABEL}</Text>
                          <Switch
                            disabled={isPending ? false : true}
                            value={
                              value
                                ? value
                                : data["flex_field"][d.API_NAME]
                            }
                            onValueChange={(value) => {
                              //onToggleSwitch;
                              onChange(value);
                            }}
                          />
                        </>
                      )}
                      rules={{
                        required: {
                          value: d.REQUIRED_FLAG === "Y" ? true : false,
                          message: "Field is required!",
                        },
                      }}
                    />
                  );
                case "NUMBER":
                  return (
                    <Controller
                      key={i}
                      control={control}
                      name={d.API_NAME}
                      defaultValue={data["flex_field"][d.API_NAME]}
                      render={({ field: { onChange, value, onBlur } }) => (
                        <TextInput
                          style={{ marginTop: "5%" }}
                          mode="outlined"
                          label={d.LABEL}
                          editable={isPending ? true : false}
                          value={
                            value
                              ? value
                              : data["flex_field"][d.API_NAME]
                          }
                          keyboardType="number-pad"
                          inputMode="numeric"
                          onChangeText={(value) => {
                            onChange(value);
                            console.log(value);
                          }}
                        />
                      )}
                      rules={{
                        required: {
                          value: d.REQUIRED_FLAG === "Y" ? true : false,
                          message: "Field is required!",
                        },
                        //regex pattern to only accept numbers
                        pattern: {
                          value: /[^0-9]/g,
                          message: "It's not a valid number",
                        },
                      }}
                    />
                  );

                default:
                  return (
                    <Controller
                      key={i}
                      control={control}
                      name={d.API_NAME}
                      defaultValue={data["flex_field"][d.API_NAME]}
                      render={({ field: { onChange, value, onBlur } }) => (
                        <TextInput
                          style={{ marginTop: "5%" }}
                          mode="outlined"
                          label={d.LABEL}
                          editable={isPending ? true : false}
                          value={
                            value
                              ? value
                              : data["flex_field"][d.API_NAME]
                          }
                          onChangeText={(value) => {
                            onChange(value);
                          }}
                        />
                      )}
                      rules={{
                        required: {
                          value: d.REQUIRED_FLAG === "Y" ? true : false,
                          message: "Field is required!",
                        },
                      }}
                    />
                  );
              }
          })}
          {/* {isPending && (
            <Button
              style={{ marginTop: "5%" }}
              disabled={!isValid}
              mode="contained"
              color="#14CD00"
              onPress={handleSubmit(onSFA)}
            >
              Send for Approval
            </Button>
          )}
          {isPending && (
            <Button
              style={{ marginTop: "1%" }}
              disabled={!isValid}
              mode="contained"
              onPress={handleSubmit(onUpdate)}
            >
              Update
            </Button>
          )}
          {isPending && (
            <Button
              style={{ marginTop: "1%" }}
              mode="contained"
              color="red"
              onPress={onDelete}
            >
              Delete
            </Button>
          )} */}
          {actions.map((button, i) => {
            return (
              <Button
                key={i}
                style={{ marginTop: "1%" }}
                disabled={!isValid}
                mode="contained"
                color="#2E3B55"
                onPress={handleSubmit((data) =>
                  handleButtonPressed(data, button.method, button.url)
                )}
              >
                {button.label}
              </Button>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

export default YourRequest;
