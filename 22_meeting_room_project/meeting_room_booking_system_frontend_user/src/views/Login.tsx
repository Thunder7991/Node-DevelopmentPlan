import { Button, message, Checkbox, Form, Input } from 'antd';
import '../style/Login.css'
import { login } from '../service/interfaces';
import { Link, useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

interface LoginUser {
    username: string;
    password: string;
}


const layout1 = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 }
}

const layout2 = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 }
}

export default function Login() {
    const navigate = useNavigate();
    const onFinish = useCallback(async (values: LoginUser) => {
        const res = await login(values.username, values.password);
        const { code, message: msg, data } = res.data;
        if (res.status === 201 || res.status === 200) {
            message.success('登录成功');
            localStorage.setItem('access_token', data.accessToken);
            localStorage.setItem('refresh_token', data.refreshToken);
            localStorage.setItem('user_info', JSON.stringify(data.userInfo));

            setTimeout(() => {
                navigate('/index')
            }, 1000)
        } else {
            message.error(res.data.data || '系统繁忙，请稍后再试');
        }
    }, [])
    return <div id="login-container">
        <h1>会议室预订系统</h1>
        <Form
            {...layout1}
            onFinish={onFinish}
            colon={false}
            autoComplete="off"
        >
            <Form.Item
                label="用户名"
                name="username"
                rules={[{ required: true, message: '请输入用户名!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="密码"
                name="password"
                rules={[{ required: true, message: '请输入密码!' }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                {...layout2}
            >
                <div className='links'>
                    <Link to='/register'>创建账号</Link>
                    <Link to='/update_password'>忘记密码</Link>
                </div>
            </Form.Item>

            <Form.Item
                {...layout2}
            >
                <Button className='btn' type="primary" htmlType="submit">
                    登录
                </Button>
            </Form.Item>
        </Form>
    </div>
}
