import * as React from 'react'

import * as styles from './loadable.scss'

// `loadable` is curried to decouple an `isLoading` check from the details of
// component implementation
export default function loadable<P>(isLoading: (p: P) => boolean) {
  // Return a higher-order component implementing the "loadable" behavior
  // See: https://goo.gl/TxPPCw
  return (C: React.ComponentClass<P>|React.SFC<P>): React.SFC<P> => {
    const LoadableComponent: React.SFC<P> = (props) => {
      if (isLoading(props)) {
        return <div className={ styles["container-wrapper"]}>
          <div className={ styles["loading"]}></div>
        </div>
      }
      return <C {...props} />
    }

    // Set pretty `displayName` for dev tooling
    LoadableComponent.displayName = `Loadable(${C.name})`
    return LoadableComponent
  }
}
