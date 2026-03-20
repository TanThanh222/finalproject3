import React, { useMemo } from "react";
import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
} from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

const isYoutubeUrl = (url = "") =>
  /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(url);

const toYoutubeEmbedUrl = (url = "") => {
  if (!url) return "";

  if (url.includes("youtube.com/embed/")) {
    return url;
  }

  const watchMatch = url.match(/[?&]v=([^&]+)/i);
  if (watchMatch?.[1]) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }

  const shortMatch = url.match(/youtu\.be\/([^?&/]+)/i);
  if (shortMatch?.[1]) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`;
  }

  return "";
};

export default function AdminCourseForm({
  form,
  editingCourse,
  fileList,
  setFileList,
  onSubmit,
  submitting = false,
}) {
  const currentLessons = Form.useWatch("lessonList", form) || [];

  const previewImage = useMemo(() => {
    const file = fileList?.[0];

    if (file?.originFileObj) {
      return URL.createObjectURL(file.originFileObj);
    }

    return "";
  }, [fileList]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      initialValues={{
        weeks: 0,
        level: "Beginner",
        price: 0,
        oldPrice: 0,
        rating: 0,
        lessonList: [],
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
        }}
      >
        <Form.Item
          label="Course Title"
          name="title"
          rules={[
            { required: true, message: "Please enter course title" },
            { min: 3, message: "Course title must be at least 3 characters" },
          ]}
        >
          <Input placeholder="Enter course title" size="large" />
        </Form.Item>

        <Form.Item
          label="Instructor"
          name="instructor"
          rules={[
            { required: true, message: "Please enter instructor" },
            {
              min: 2,
              message: "Instructor name must be at least 2 characters",
            },
          ]}
        >
          <Input placeholder="Enter instructor name" size="large" />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Please enter category" }]}
        >
          <Input
            placeholder="Design / Development / Marketing..."
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Level"
          name="level"
          rules={[{ required: true, message: "Please select level" }]}
        >
          <Select
            size="large"
            options={LEVELS.map((level) => ({
              label: level,
              value: level,
            }))}
          />
        </Form.Item>

        <Form.Item label="Weeks" name="weeks">
          <InputNumber min={0} style={{ width: "100%" }} size="large" />
        </Form.Item>

        <Form.Item label="Price" name="price">
          <InputNumber min={0} style={{ width: "100%" }} size="large" />
        </Form.Item>

        <Form.Item label="Old Price" name="oldPrice">
          <InputNumber min={0} style={{ width: "100%" }} size="large" />
        </Form.Item>

        <Form.Item label="Rating" name="rating">
          <InputNumber
            min={0}
            max={5}
            step={0.1}
            style={{ width: "100%" }}
            size="large"
          />
        </Form.Item>
      </div>

      <Form.Item
        label="Overview"
        name="overview"
        rules={[
          {
            max: 3000,
            message: "Overview must be at most 3000 characters",
          },
        ]}
      >
        <TextArea rows={4} placeholder="Enter course overview" />
      </Form.Item>

      <Form.Item
        label="Course Link"
        name="courseLink"
        rules={[
          {
            validator(_, value) {
              if (!value || isYoutubeUrl(value)) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("Please enter a valid YouTube link"),
              );
            },
          },
        ]}
      >
        <Input placeholder="https://youtube.com/watch?v=..." size="large" />
      </Form.Item>

      <Form.Item label="Course Image">
        <Upload
          beforeUpload={() => false}
          maxCount={1}
          fileList={fileList}
          onChange={({ fileList: newFileList }) => setFileList(newFileList)}
          listType="text"
          accept="image/*"
        >
          <Button icon={<UploadOutlined />}>Choose Image</Button>
        </Upload>

        {previewImage && (
          <div style={{ marginTop: 12 }}>
            <img
              src={previewImage}
              alt="New preview"
              style={{
                width: 220,
                height: 124,
                objectFit: "cover",
                borderRadius: 16,
                border: "1px solid #e5e7eb",
                boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
              }}
            />
          </div>
        )}

        {!previewImage && editingCourse?.image && fileList.length === 0 && (
          <div style={{ marginTop: 12 }}>
            <img
              src={editingCourse.image}
              alt={editingCourse.title}
              style={{
                width: 220,
                height: 124,
                objectFit: "cover",
                borderRadius: 16,
                border: "1px solid #e5e7eb",
                boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
              }}
            />
          </div>
        )}
      </Form.Item>

      <div
        style={{
          marginTop: 20,
          marginBottom: 14,
          fontWeight: 800,
          fontSize: 20,
          color: "#0f172a",
        }}
      >
        Course Lessons
      </div>

      <Form.List name="lessonList">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }, index) => {
              const lesson = currentLessons?.[name] || {};
              const embedUrl = toYoutubeEmbedUrl(lesson?.videoUrl || "");

              return (
                <Card
                  key={key}
                  size="small"
                  style={{
                    marginBottom: 16,
                    borderRadius: 16,
                    background: "#f8fafc",
                    border: "1px solid #e5e7eb",
                  }}
                  title={
                    <span style={{ fontWeight: 700 }}>Lesson {index + 1}</span>
                  }
                  extra={
                    <Button danger type="text" onClick={() => remove(name)}>
                      Remove
                    </Button>
                  }
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(240px, 1fr))",
                      gap: 16,
                    }}
                  >
                    <Form.Item
                      {...restField}
                      label="Lesson Title"
                      name={[name, "title"]}
                      rules={[
                        {
                          required: true,
                          message: "Please enter lesson title",
                        },
                        {
                          min: 2,
                          message: "Lesson title must be at least 2 characters",
                        },
                      ]}
                    >
                      <Input placeholder="Lesson title" size="large" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      label="Duration (minutes)"
                      name={[name, "duration"]}
                      rules={[
                        {
                          required: true,
                          message: "Please enter lesson duration",
                        },
                        {
                          validator(_, value) {
                            if (value >= 1) return Promise.resolve();
                            return Promise.reject(
                              new Error("Duration must be greater than 0"),
                            );
                          },
                        },
                      ]}
                    >
                      <InputNumber
                        min={1}
                        style={{ width: "100%" }}
                        size="large"
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      label="Video URL"
                      name={[name, "videoUrl"]}
                      rules={[
                        {
                          validator(_, value) {
                            if (!value || isYoutubeUrl(value)) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error("Please enter a valid YouTube link"),
                            );
                          },
                        },
                      ]}
                    >
                      <Input
                        placeholder="https://youtube.com/watch?v=..."
                        size="large"
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      label="Order"
                      name={[name, "order"]}
                      rules={[
                        {
                          required: true,
                          message: "Please enter lesson order",
                        },
                        {
                          validator(_, value) {
                            if (value >= 1) return Promise.resolve();
                            return Promise.reject(
                              new Error("Order must be greater than 0"),
                            );
                          },
                        },
                      ]}
                    >
                      <InputNumber
                        min={1}
                        style={{ width: "100%" }}
                        size="large"
                      />
                    </Form.Item>
                  </div>

                  <Form.Item
                    {...restField}
                    label="Lesson Description"
                    name={[name, "description"]}
                    rules={[
                      {
                        max: 1000,
                        message:
                          "Lesson description must be at most 1000 characters",
                      },
                    ]}
                  >
                    <TextArea rows={3} placeholder="Lesson description" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "isPreview"]}
                    valuePropName="checked"
                  >
                    <Checkbox>Allow preview for this lesson</Checkbox>
                  </Form.Item>

                  {embedUrl && (
                    <div style={{ marginTop: 8 }}>
                      <div
                        style={{
                          marginBottom: 8,
                          fontWeight: 700,
                          color: "#334155",
                        }}
                      >
                        Video Preview
                      </div>
                      <iframe
                        width="100%"
                        height="260"
                        src={embedUrl}
                        title={`lesson-preview-${index + 1}`}
                        style={{
                          border: 0,
                          borderRadius: 14,
                          background: "#000",
                        }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                </Card>
              );
            })}

            <Button
              type="dashed"
              onClick={() =>
                add({
                  title: "",
                  description: "",
                  videoUrl: "",
                  duration: 10,
                  order: fields.length + 1,
                  isPreview: false,
                })
              }
              block
              icon={<PlusOutlined />}
              style={{
                borderRadius: 12,
                height: 44,
                fontWeight: 700,
              }}
            >
              Add Lesson
            </Button>
          </>
        )}
      </Form.List>

      <div
        style={{
          marginTop: 24,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          loading={submitting}
        >
          {editingCourse ? "Update Course" : "Create Course"}
        </Button>
      </div>
    </Form>
  );
}
