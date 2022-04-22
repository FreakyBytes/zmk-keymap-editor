import '@fortawesome/fontawesome-free/css/all.css'
import keyBy from 'lodash/keyBy'
import { useEffect, useMemo, useState } from 'react'

import './App.css';
import { DefinitionsContext } from './providers'
import { loadKeycodes } from './keycodes'
import { loadBehaviours } from './api'
import KeyboardPicker from './Pickers/KeyboardPicker';
import Spinner from './Common/Spinner';
import Keyboard from './Keyboard/Keyboard'

function App() {
  const position = { x: 1, y: 1 }
  const rotation = { r: 0, rx: 0, ry: 0 }
  const size = { u: 1, h: 1 }
  const value = '&kp'
  const params = [
    { value: 'N1' }
  ]

  const [definitions, setDefinitions] = useState(null)
  // const [config, setConfig] = useState(null)
  const [source, setSource] = useState(null)
  const [sourceOther, setSourceOther] = useState(null)
  const [layout, setLayout] = useState(null)
  const [keymap, setKeymap] = useState(null)
  const [editingKeymap, setEditingKeymap] = useState({})
  const [saving, setSaving] = useState(false)

  const handleCompile = useMemo(() => {}, [])
  const handleCommitChanges = useMemo(() => {}, [])

  const handleKeyboardSelected = useMemo(() => function(event) {
    const { source, layout, keymap, ...other } = event

    console.log('keyboard selected', event)
    setSource(source)
    setSourceOther(other)
    setLayout(layout)
    setKeymap(keymap)
    setEditingKeymap(null)
  }, [
    setSource,
    setSourceOther,
    setLayout,
    setKeymap,
    setEditingKeymap
  ])

  useEffect(() => {
    Promise.all([
      loadKeycodes(),
      loadBehaviours()
    ]).then(([keycodes, behaviours]) => {
      keycodes.indexed = keyBy(keycodes, 'code')
      behaviours.indexed = keyBy(behaviours, 'code')

      setDefinitions({ keycodes, behaviours })
    })
  }, [])

  return (
    <div className="App">
      <KeyboardPicker onSelect={handleKeyboardSelected} />
      <div id="actions">
        {source === 'local' && (
          <button
            disabled={!editingKeymap}
            onClick={handleCompile}
          >
            Save Local
          </button>
        )}
        {source === 'github' && (
          <button
            title="Commit keymap changes to GitHub repository"
            disabled={!editingKeymap}
            onClick={handleCommitChanges}
          >
            {saving ? 'Saving' : 'Commit Changes'}
            {saving && <Spinner />}
          </button>
        )}
      </div>
      <header className="App-header">
        {definitions && (
          <DefinitionsContext.Provider value={definitions}>
            {layout && keymap && (
              <Keyboard
                layout={layout}
                keymap={keymap}
                onUpdate={() => {}}
              />
            )}
          </DefinitionsContext.Provider>
        )}
      </header>
    </div>
  );
}

export default App;
