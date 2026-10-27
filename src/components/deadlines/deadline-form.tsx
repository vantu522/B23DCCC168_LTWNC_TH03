"use client";

import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Radio,
  Button,
  message,
  Row,
  Col,
} from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { CreateDeadlineInput, Deadline, Subject } from "@/types/deadline";
import { createDeadlineAction } from "@/features/deadlines/deadline.actions";

const { TextArea } = Input;

interface DeadlineFormProps {
  open: boolean;
  subjects: Subject[];
  onCancel: () => void;
  onSuccess: (newDeadline: Deadline) => void;
}

export default function DeadlineForm({
  open,
  subjects,
  onCancel,
  onSuccess,
}: DeadlineFormProps) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: {
    subjectId: string;
    title: string;
    description?: string;
    dueDateTime: dayjs.Dayjs;
    priority: "high" | "medium" | "low";
    type: "Thực hành" | "Bài tập" | "Bài tập lớn" | "Tiểu luận" | "Kiểm tra";
    target?: string;
    submissionUrl?: string;
  }) => {
    setSubmitting(true);
    try {
      const payload: CreateDeadlineInput = {
        subjectId: values.subjectId,
        title: values.title.trim(),
        description: values.description?.trim(),
        dueDate: values.dueDateTime.toISOString(),
        priority: values.priority,
        type: values.type,
        target: values.target,
        submissionUrl: values.submissionUrl?.trim(),
      };

      const res = await createDeadlineAction(payload);
      if (res.success && res.data) {
        message.success(res.message || "Tạo deadline thành công!");
        form.resetFields();
        onSuccess(res.data);
      } else {
        message.error(res.error || "Không thể tạo deadline");
      }
    } catch {
      message.error("Lỗi khi kết nối tới máy chủ");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-slate-800 text-lg">
          <PlusCircleOutlined className="text-[#c8102e]" />
          <span>Thêm hạn chót (Deadline) mới</span>
        </div>
      }
      open={open}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      footer={null}
      destroyOnClose
      width={680}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          priority: "medium",
          type: "Thực hành",
          target: "Cá nhân",
          dueDateTime: dayjs().add(3, "day").hour(23).minute(59),
        }}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Môn học"
              name="subjectId"
              rules={[{ required: true, message: "Vui lòng chọn môn học!" }]}
            >
              <Select
                placeholder="Chọn môn học"
                options={subjects.map((s) => ({
                  value: s.id,
                  label: `${s.code} - ${s.name}`,
                }))}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Hạn chót (Ngày & Giờ)"
              name="dueDateTime"
              rules={[{ required: true, message: "Vui lòng chọn hạn chót!" }]}
            >
              <DatePicker
                showTime={{ format: "HH:mm" }}
                format="DD/MM/YYYY HH:mm"
                className="w-full"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Tiêu đề deadline"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề bài tập!" }]}
        >
          <Input placeholder="Ví dụ: Thực hành 04: Next.js & Server Actions" />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item label="Mức độ ưu tiên" name="priority">
              <Radio.Group buttonStyle="solid">
                <Radio.Button value="high" className="text-red-600">Gấp 🔥</Radio.Button>
                <Radio.Button value="medium" className="text-amber-600">Vừa</Radio.Button>
                <Radio.Button value="low" className="text-green-600">Thấp</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item label="Phân loại" name="type">
              <Select
                options={[
                  { value: "Thực hành", label: "Thực hành" },
                  { value: "Bài tập lớn", label: "Bài tập lớn" },
                  { value: "Bài tập", label: "Bài tập" },
                  { value: "Tiểu luận", label: "Tiểu luận" },
                  { value: "Kiểm tra", label: "Kiểm tra" },
                ]}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item label="Hình thức" name="target">
              <Radio.Group>
                <Radio value="Cá nhân">Cá nhân</Radio>
                <Radio value="Nhóm">Nhóm</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Đường dẫn nộp bài (URL)" name="submissionUrl">
          <Input placeholder="https://qldt.ptit.edu.vn hoặc link Form..." />
        </Form.Item>

        <Form.Item label="Mô tả chi tiết yêu cầu" name="description">
          <TextArea rows={3} placeholder="Nội dung cần thực hiện, định dạng file..." />
        </Form.Item>

        <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-slate-100">
          <Button onClick={onCancel}>Hủy</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
            className="bg-[#c8102e] hover:bg-[#b00e28]"
          >
            Lưu Deadline
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
