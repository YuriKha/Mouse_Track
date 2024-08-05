import React from "react";

export default function CodeData(props) {
  const code = `
    &lt;!-- HotZone Tracking Code for my site --&gt;
    &lt;script&gt;
        (function(h,o,t,z,n,e){
            h.hz=h.hz||function(){(h.hz.q=h.hz.q||[]).push(arguments)};
            h._hzSettings={hzid:${props.ID}};
            n=o.getElementsByTagName('head')[0];
            e=o.createElement('script');e.async=1;
            e.src=t+h._hzSettings.hzid+z;
            n.appendChild(e);
        })(window,document,'http://localhost:3001/mousetracker/','/trackMouse.js');
    &lt;/script&gt;
`;
  return (
    <pre className="cc-code-pre">
      <code
        translate="no"
        className="css-main-code"
        dangerouslySetInnerHTML={{ __html: code }}
      />
    </pre>
  );
}
