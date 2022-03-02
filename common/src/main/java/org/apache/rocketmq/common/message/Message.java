/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.apache.rocketmq.common.message;

import java.io.Serializable;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import static org.apache.rocketmq.common.MixAll.wrapTopic;

public class Message implements Serializable {
    private static final long serialVersionUID = 8445773977080406428L;

    private String topic;
    private int flag;
    private Map<String, String> properties;
    private byte[] body;
    private String transactionId;

    public Message() {
    }

    public Message(String topic, byte[] body) {
        this(topic, "", "", 0, body, true);
    }

    public Message(String topic, String tags, String keys, int flag, byte[] body, boolean waitStoreMsgOK) {
        this.topic =wrapTopic(topic);
        this.flag = flag;
        this.body = body;

        if (tags != null && tags.length() > 0) {
            this.setTags(tags);
        }

        if (keys != null && keys.length() > 0) {
            this.setKeys(keys);
        }

        this.setWaitStoreMsgOK(waitStoreMsgOK);
    }

    public Message(String topic, String tags, byte[] body) {
        this(topic, tags, "", 0, body, true);
    }

    public Message(String topic, String tags, String keys, byte[] body) {
        this(topic, tags, keys, 0, body, true);
    }

    public void setKeys(String keys) {
        this.putProperty(MessageConst.PROPERTY_KEYS, keys);
    }

    void putProperty(final String name, final String value) {
        if (null == this.properties) {
            this.properties = new HashMap<String, String>();
        }

        this.properties.put(name, value);
    }

    void clearProperty(final String name) {
        if (null != this.properties) {
            this.properties.remove(name);
        }
    }

    public void putUserProperty(final String name, final String value) {
        if (MessageConst.STRING_HASH_SET.contains(name)) {
            throw new RuntimeException(String.format(
                "The Property<%s> is used by system, input another please", name));
        }

        if (value == null || value.trim().isEmpty()
            || name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException(
                "The name or value of property can not be null or blank string!"
            );
        }

        this.putProperty(name, value);
    }

    public String getUserProperty(final String name) {
        return this.getProperty(name);
    }

    public String getProperty(final String name) {
        if (null == this.properties) {
            this.properties = new HashMap<String, String>();
        }

        return this.properties.get(name);
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = wrapTopic(topic);
    }

    public String getTags() {
        return this.getProperty(MessageConst.PROPERTY_TAGS);
    }

    public void setTags(String tags) {
        this.putProperty(MessageConst.PROPERTY_TAGS, tags);
    }

    public String getKeys() {
        return this.getProperty(MessageConst.PROPERTY_KEYS);
    }

    public void setKeys(Collection<String> keys) {
        StringBuilder sb = new StringBuilder();
        for (String k : keys) {
            sb.append(k);
            sb.append(MessageConst.KEY_SEPARATOR);
        }

        this.setKeys(sb.toString().trim());
    }

    public int getDelayTimeLevel() {
        String t = this.getProperty(MessageConst.PROPERTY_DELAY_TIME_LEVEL);
        if (t != null) {
            return Integer.parseInt(t);
        }

        return 0;
    }

    public void setDelayTimeLevel(int level) {
        this.putProperty(MessageConst.PROPERTY_DELAY_TIME_LEVEL, String.valueOf(level));
    }

    public boolean isWaitStoreMsgOK() {
        String result = this.getProperty(MessageConst.PROPERTY_WAIT_STORE_MSG_OK);
        if (null == result) {
            return true;
        }

        return Boolean.parseBoolean(result);
    }

    public void setWaitStoreMsgOK(boolean waitStoreMsgOK) {
        this.putProperty(MessageConst.PROPERTY_WAIT_STORE_MSG_OK, Boolean.toString(waitStoreMsgOK));
    }

    public void setInstanceId(String instanceId) {
        this.putProperty(MessageConst.PROPERTY_INSTANCE_ID, instanceId);
    }

    public int getFlag() {
        return flag;
    }

    public void setFlag(int flag) {
        this.flag = flag;
    }

    public byte[] getBody() {
        return body;
    }

    public void setBody(byte[] body) {
        this.body = body;
    }

    public Map<String, String> getProperties() {
        return properties;
    }

    void setProperties(Map<String, String> properties) {
        this.properties = properties;
    }

    public String getBuyerId() {
        return getProperty(MessageConst.PROPERTY_BUYER_ID);
    }

    public void setBuyerId(String buyerId) {
        putProperty(MessageConst.PROPERTY_BUYER_ID, buyerId);
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }
    /**
     * <p> 设置消息的定时投递时间（绝对时间),最大延迟时间为7天. </p> <ol> <li>延迟投递: 延迟3s投递, 设置为: System.currentTimeMillis() + 3000;</li>
     * <li>定时投递: 2016-02-01 11:30:00投递, 设置为: new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse("2016-02-01
     * 11:30:00").getTime()</li> </ol>
     */
    public void setStartDeliverTime(final long value) {
        putSystemProperties(SystemPropKey.STARTDELIVERTIME, String.valueOf(value));
    }

    /**
     * 添加系统属性K-V对.
     *
     * @param key 属性Key
     * @param value 属性值
     */
    void putSystemProperties(final String key, final String value) {

        if (key != null && value != null) {
            putProperty(key, value);
        }
    }

    /**
     * 该类预定义一些系统键.
     */
    static public class SystemPropKey {
        public static final String TAG = "__TAG";
        public static final String KEY = "__KEY";
        public static final String MSGID = "__MSGID";
        public static final String SHARDINGKEY = "__SHARDINGKEY";
        public static final String RECONSUMETIMES = "__RECONSUMETIMES";
        public static final String BORNTIMESTAMP = "__BORNTIMESTAMP";
        public static final String BORNHOST = "__BORNHOST";
        /**
         * 设置消息的定时投递时间（绝对时间). <p>例1: 延迟投递, 延迟3s投递, 设置为: System.currentTimeMillis() + 3000; <p>例2: 定时投递,
         * 2016-02-01 11:30:00投递, 设置为: new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse("2016-02-01
         * 11:30:00").getTime()
         */
        public static final String STARTDELIVERTIME = "__STARTDELIVERTIME";
    }


    @Override
    public String toString() {
        return "Message{" +
            "topic='" + topic + '\'' +
            ", flag=" + flag +
            ", properties=" + properties +
            ", body=" + Arrays.toString(body) +
            ", transactionId='" + transactionId + '\'' +
            '}';
    }
}
