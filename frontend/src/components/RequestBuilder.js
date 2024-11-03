// src/components/RequestBuilder.js
import React, { useState } from 'react';
import './req.css';


const InnerPanel=(props)=>{
  const [response, setResponse] = useState('');
  const [activeTab, setActiveTab] = useState('headers');
  const [headers, setHeaders] = useState([{ key: '', value: '' }]);
  const [menuOpen, setMenuOpen] = useState(null);
  const body = typeof props.setBody === 'object' ? JSON.stringify(props.setBody, null, 2) : props.setBody;
  console.log(props.setBody);

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const removeHeader = (index) => {
    const newHeaders = headers.filter((_, i) => i !== index);
    setHeaders(newHeaders);
    setMenuOpen(null)
  };

  const toggleMenu = (index) => {
    console.log(index)
    setMenuOpen(menuOpen === index ? null : index);
  };


  return (
  <div>
    <div className="tabs">
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); setActiveTab('headers'); }}
      className={activeTab === 'headers' ? 'active' : ''}
    >
      Headers
    </a>
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); setActiveTab('body'); }}
      className={activeTab === 'body' ? 'active' : ''}
    >
      Body
    </a>
  </div>
  {activeTab === 'headers' && (
              <>
                <table>
                  <thead>
                    <tr>
                      <th>Header Key</th>
                      <th>Header Value</th>
                      <th></th>
                    </tr>
                  </thead>
                  
                  <tbody >
                    {props.setHeader.map((header, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="text"
                            value={header.key}
                            onChange={(e) => props.handleHeaderChange(index, 'key', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={header.value}
                            onChange={(e) => props.handleHeaderChange(index, 'value', e.target.value)}
                          />
                        </td>
                        <td>
                          {/* <button onClick={() => removeHeader(index)}>Remove</button> */}
                         {!props.setHeader && <span class="icon-button" onClick={()=>toggleMenu(index)}>&#8942;</span>}
                          {menuOpen===index && (
                            <div className="dropdown-menu">
                              <ul>
                                <li onClick={() => removeHeader(index)}>Delete</li>
                              </ul>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  
                </table>
                {!props.setHeader && <button onClick={addHeader}>Add Header</button>}
              </>
            )}
    {activeTab === 'body' && (
      <textarea
        // value={body}
        value={body}
        // onChange={(e) => setBody(e.target.value)}
        placeholder="Body (JSON)"
        rows={4}
      />
    )}
  </div> ) 
}


const RequestBuilder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState([{ key: 'Content-Type', value: 'application/json' }]);
  const [body, setBody] = useState('');
  const [response, setResponse] = useState('');
  const [activeTab, setActiveTab] = useState('headers');
  const [menuOpen, setMenuOpen] = useState(null);
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);
  const [responseHeaders,setResponseHeaders]=useState([]);
  const toggleMenu = (index) => {
    console.log(index)
    setMenuOpen(menuOpen === index ? null : index);
  };

  const savedAPIs = [ 
    { id: 1, name: 'Get User Data' },
    { id: 2, name: 'Post Order' },
  ];

  const handleHeaderChange = (index, field, value) => {
    const newHeaders = [...headers];
    console.log(index, field, value)
    newHeaders[index][field] = value;
    console.log(newHeaders)
    setHeaders(newHeaders);
  };

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const removeHeader = (index) => {
    const newHeaders = headers.filter((_, i) => i !== index);
    setHeaders(newHeaders);
    setMenuOpen(null)
  };

  const sendRequest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    const responseHead = [];
    const headerObject = headers.reduce((acc, header) => {
      console.log(method);
      if (header.key) acc[header.key] = header.value;
      return acc;
    }, {});

    try {
      const response = await fetch(url, {
        method,
        headers: {
          // 'Content-Type': 'application/json',
          ...headerObject,
        },
        body: method === 'POST' ? JSON.stringify(JSON.parse(body)) : undefined,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      
      response.headers.forEach((value, key) => {
        responseHead.push({ key, value });
        console.log( key, value);
      });
      const json = await response.json();
      setResponse(json);
      setResponseHeaders(responseHead)
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container">
      <div className="sidebar">
        <h1>Saved APIs</h1>
        <ul>
          {savedAPIs.map(api => (
            <li key={api.id}>{api.name}</li>
          ))}
        </ul>
      </div>

      <div className="request-builder">
        <h4>API Request Builder</h4>

        <div className="input-group">
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            {['GET', 'POST', 'PUT', 'DELETE'].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Request URL"
          />

          <button onClick={sendRequest} disabled={loading}>
            {loading ? 'Sending...' : 'Send Request'}
          </button>
        </div>
        <div className="request-response">
          <div className="request-section">
            <h2>Request</h2>

            <div className="tabs">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setActiveTab('headers'); }}
                className={activeTab === 'headers' ? 'active' : ''}
              >
                Headers
              </a>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setActiveTab('body'); }}
                className={activeTab === 'body' ? 'active' : ''}
              >
                Body
              </a>
            </div>

            {activeTab === 'headers' && (
              <>
                <table>
                  <thead>
                    <tr>
                      <th>Header Key</th>
                      <th>Header Value</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {headers.map((header, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="text"
                            value={header.key}
                            onChange={(e) => handleHeaderChange(index, 'key', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={header.value}
                            onChange={(e) => handleHeaderChange(index, 'value', e.target.value)}
                          />
                        </td>
                        <td>
                          {/* <button onClick={() => removeHeader(index)}>Remove</button> */}
                          <span class="icon-button" onClick={()=>toggleMenu(index)}>&#8942;</span>
                          {menuOpen===index && (
                            <div className="dropdown-menu">
                              <ul>
                                {/* <li onClick={handleEdit}>Edit</li> */}
                                <li onClick={() => removeHeader(index)}>Delete</li>
                              </ul>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button onClick={addHeader}>Add Header</button>
              </>
            )}

            {activeTab === 'body' && (
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Body (JSON)"
                rows={4}
              />
            )}
          </div>

          <div className="response-section">
            <h2>Response</h2>
           <InnerPanel setHeader={responseHeaders} setBody={response} handleHeaderChange={handleHeaderChange} />
            {/* {error && <div className="error-message">{error}</div>} */}
            {/* <ol><pre>{typeof response === 'object' ? JSON.stringify(response, null, 2) : response}</pre></ol> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestBuilder;
