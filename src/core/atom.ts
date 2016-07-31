
export interface IAtom extends IObservable {
}

/**
 * Anything that can be used to _store_ state is an Atom in mobx. Atom's have two important jobs
 *
 * 1) detect when they are being _used_ and report this (using reportObserved). This allows mobx to make the connection between running functions and the data they used
 * 2) they should notify mobx whenever they have _changed_. This way mobx can re-run any functions (derivations) that are using this atom.
 */
export class Atom implements IAtom {
	isPendingUnobservation: boolean; // for effective unobserving
	isObserved = false;
	observers0 = new SimpleSet<IDerivation>();
	observers1 = new SimpleSet<IDerivation>();
	observers2 = new SimpleSet<IDerivation>();

	diffValue = 0;
	lastAccessedBy = 0;

	/**
	 * Create a new atom. For debugging purposes it is recommended to give it a name.
	 * The onBecomeObserved and onBecomeUnobserved callbacks can be used for resource management.
	 */
	constructor(public name = "Atom@" + getNextId(), public onBecomeObserved: () => void = noop, public onBecomeUnobserved = noop) { }

	/**
	 * Invoke this method to notify mobx that your atom has been used somehow.
	 */
	public reportObserved() {
		reportObserved(this);
	}

	/**
	 * Invoke this method _after_ this method has changed to signal mobx that all its observers should invalidate.
	 */
	public reportChanged() {
		propagateChanged(this);
		runReactions();
	}

	toString() {
		return this.name;
	}
}

import {IObservable, propagateChanged, reportObserved} from "./observable";
import {IDerivation} from "./derivation";
import {runReactions} from "./reaction";
import {noop, getNextId} from "../utils/utils";
import {SimpleSet} from "../utils/set";
