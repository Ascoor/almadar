import React from 'react';
import EchoDemo from './EchoInitializer';
import EchoListener from './EchoListener';
import TestListener from './TestListener';

const EchoWrapper = ({ userId }) => (
<div className="space-y-6">

<EchoListener   />

</div>
);

export default EchoWrapper;